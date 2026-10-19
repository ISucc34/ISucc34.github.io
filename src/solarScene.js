import * as THREE from 'three'

const TAU = Math.PI * 2
const SCALE = 5 // world units per unit of `o` (orbit diameter) and `p` (planet diameter)

// ---- procedural textures (painted on canvases, so no image files are needed) ----
function rgba(color) {
  const c = document.createElement('canvas')
  c.width = c.height = 1
  const x = c.getContext('2d', { willReadFrequently: true })
  x.fillStyle = color
  x.fillRect(0, 0, 1, 1)
  return x.getImageData(0, 0, 1, 1).data
}

function toTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function surfaceTexture({ base, bands = [], spots = [] }) {
  const W = 1024, H = 512
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  g.fillStyle = base
  g.fillRect(0, 0, W, H)
  for (const [y0, y1, col] of bands) {
    const [r, gr, b, a] = rgba(col)
    const grad = g.createLinearGradient(0, y0 * H, 0, y1 * H)
    grad.addColorStop(0, `rgba(${r},${gr},${b},0)`)
    grad.addColorStop(0.5, `rgba(${r},${gr},${b},${a / 255})`)
    grad.addColorStop(1, `rgba(${r},${gr},${b},0)`)
    g.fillStyle = grad
    g.fillRect(0, y0 * H, W, (y1 - y0) * H)
  }
  for (const [x, y, rx, ry, col] of spots) {
    const [r, gr, b, a] = rgba(col)
    for (const dx of [-W, 0, W]) { // draw wrapped copies so the seam is invisible
      g.save()
      g.translate(x * W + dx, y * H)
      g.scale(rx * W, ry * H)
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, 1)
      grad.addColorStop(0, `rgba(${r},${gr},${b},${a / 255})`)
      grad.addColorStop(0.55, `rgba(${r},${gr},${b},${a / 255})`)
      grad.addColorStop(1, `rgba(${r},${gr},${b},0)`)
      g.fillStyle = grad
      g.beginPath()
      g.arc(0, 0, 1, 0, TAU)
      g.fill()
      g.restore()
    }
  }
  for (let i = 0; i < 2500; i++) { // fine grain
    g.fillStyle = Math.random() < 0.5 ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.06)'
    g.fillRect(Math.random() * W, Math.random() * H, 2, 2)
  }
  return toTexture(c)
}

function sunTexture() {
  const spots = []
  for (let i = 0; i < 40; i++) {
    spots.push([Math.random(), Math.random(), 0.02 + Math.random() * 0.05, 0.03 + Math.random() * 0.06,
      Math.random() < 0.5 ? 'rgba(255,230,120,.7)' : 'rgba(226,87,10,.55)'])
  }
  return surfaceTexture({ base: '#ff9a1f', spots })
}

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(255,210,100,1)')
  grad.addColorStop(0.2, 'rgba(255,160,50,.55)')
  grad.addColorStop(1, 'rgba(255,120,20,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return toTexture(c)
}

function ringTexture(innerRatio) {
  const S = 512
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  g.lineWidth = 1.6
  for (let r = innerRatio * S / 2; r < S / 2; r += 1) {
    const f = (r - innerRatio * S / 2) / (S / 2 - innerRatio * S / 2)
    const gap = f > 0.58 && f < 0.66 ? 0.05 : 1 // a Cassini-style gap
    const alpha = (0.3 + 0.5 * Math.abs(Math.sin(r * 0.4))) * gap
    g.strokeStyle = `rgba(225,205,150,${alpha})`
    g.beginPath()
    g.arc(S / 2, S / 2, r, 0, TAU)
    g.stroke()
  }
  return toTexture(c)
}

// ---- the scene ----
export function createSolarScene({ container, planets, labels, onSelect }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }) // transparent: the CSS stars show through
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.prepend(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)

  // light comes from the sun; a little ambient light keeps the night sides visible
  scene.add(new THREE.AmbientLight(0xffffff, 1.0))
  scene.add(new THREE.PointLight(0xfff1d6, 3.2, 0, 0))

  const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 48, 32),
    new THREE.MeshBasicMaterial({ map: sunTexture() }),
  )
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }))
  glow.scale.setScalar(6)
  scene.add(sun, glow)

  const hits = []
  const items = planets.map((p, i) => {
    const radius = Math.max(0.14, p.p * 6)
    const orbitR = p.o * SCALE

    const pivot = new THREE.Group()      // spins to move the planet around the sun
    pivot.rotation.y = THREE.MathUtils.degToRad(p.a)
    const holder = new THREE.Group()     // sits on the orbit; cancels the pivot so the tilt keeps pointing the same way
    holder.position.x = orbitR
    const tilt = new THREE.Group()       // axial tilt; also scaled up on hover
    tilt.rotation.z = p.tilt
    pivot.add(holder)
    holder.add(tilt)

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 64, 40),
      new THREE.MeshStandardMaterial({ map: surfaceTexture(p), roughness: 1, metalness: 0 }),
    )
    tilt.add(mesh)

    if (p.ring) {
      const inner = radius * 1.3, outer = radius * 2.4
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 128),
        new THREE.MeshBasicMaterial({ map: ringTexture(inner / outer), side: THREE.DoubleSide, transparent: true, depthWrite: false }),
      )
      ring.rotation.x = -Math.PI / 2
      tilt.add(ring)
    }

    // generous invisible click target, since planets keep moving
    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(Math.max(radius * 1.7, 0.32), 8, 6),
      new THREE.MeshBasicMaterial({ visible: false }),
    )
    hit.userData.index = i
    tilt.add(hit)
    hits.push(hit)

    const pts = []
    for (let k = 0; k < 160; k++) pts.push(new THREE.Vector3(Math.cos((k / 160) * TAU) * orbitR, 0, Math.sin((k / 160) * TAU) * orbitR))
    scene.add(new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 }),
    ))
    scene.add(pivot)

    return { p, radius, pivot, holder, tilt, mesh, scale: 1 }
  })

  // ---- sizing: low sideways angle, as close as possible while the whole system stays in frame ----
  let width = 1, height = 1
  const probe = new THREE.Vector3()
  const frontPoint = new THREE.Vector3(0, -0.8, SCALE + 0.5) // front of the outer orbit, plus label room
  const backPoint = new THREE.Vector3(0, 0.5, -SCALE - 0.4)
  const sidePoint = new THREE.Vector3(SCALE + 0.5, 0, 0)
  const fits = () => {
    camera.updateMatrixWorld()
    return probe.copy(frontPoint).project(camera).y > -0.88
      && probe.copy(backPoint).project(camera).y < 0.9
      && Math.abs(probe.copy(sidePoint).project(camera).x) < 0.93
  }
  function resize() {
    width = container.clientWidth || 1
    height = container.clientHeight || 1
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    const portrait = camera.aspect < 1
    const elev = THREE.MathUtils.degToRad(portrait ? 34 : 14) // sideways view; a bit steeper on phones
    const aim = new THREE.Vector3(0, 0, portrait ? 0 : 4)     // aim toward the front so the near planets fit
    for (let d = 7; d < 40; d += 0.1) {
      camera.position.set(0, d * Math.sin(elev), d * Math.cos(elev))
      camera.lookAt(aim)
      if (fits()) break
    }
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  // ---- hover + click on the planets ----
  const ray = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  let hovered = -1
  function pick(e) {
    const r = renderer.domElement.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    const hit = ray.intersectObjects(hits, false)[0]
    return hit ? hit.object.userData.index : -1
  }
  function setHover(i) {
    hovered = i
    renderer.domElement.style.cursor = i >= 0 ? 'pointer' : ''
    labels.forEach((el, k) => el?.classList.toggle('hot', k === i))
  }
  const onMove = (e) => setHover(pick(e))
  const onLeave = () => setHover(-1)
  const onClick = (e) => {
    const i = pick(e)
    if (i >= 0) onSelect(planets[i].path)
  }
  const canvas = renderer.domElement
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerleave', onLeave)
  canvas.addEventListener('click', onClick)
  const labelEnter = labels.map((el, i) => {
    const f = () => setHover(i)
    el?.addEventListener('pointerenter', f)
    el?.addEventListener('pointerleave', onLeave)
    return f
  })

  // ---- animation ----
  const v = new THREE.Vector3()
  let last = performance.now()
  renderer.setAnimationLoop((now) => {
    const dt = reduceMotion ? 0 : Math.min((now - last) / 1000, 0.1)
    last = now

    sun.rotation.y += dt * 0.05
    for (const [i, it] of items.entries()) {
      it.pivot.rotation.y += (dt * TAU) / it.p.t
      it.holder.rotation.y = -it.pivot.rotation.y
      it.mesh.rotation.y += ((it.p.rev ? -1 : 1) * dt * TAU) / it.p.r
      it.scale += ((hovered === i ? 1.3 : 1) - it.scale) * 0.15
      it.tilt.scale.setScalar(it.scale)
    }
    renderer.render(scene, camera)

    // put each HTML label just under its planet
    for (const [i, it] of items.entries()) {
      const el = labels[i]
      if (!el) continue
      it.tilt.getWorldPosition(v)
      v.y -= it.radius * it.scale * (it.p.ring ? 1.35 : 1.1)
      v.project(camera)
      el.style.transform = `translate(${(v.x * 0.5 + 0.5) * width}px, ${(-v.y * 0.5 + 0.5) * height}px) translate(-50%, 4px)`
    }
  })

  return function dispose() {
    renderer.setAnimationLoop(null)
    ro.disconnect()
    canvas.removeEventListener('pointermove', onMove)
    canvas.removeEventListener('pointerleave', onLeave)
    canvas.removeEventListener('click', onClick)
    labels.forEach((el, i) => {
      el?.removeEventListener('pointerenter', labelEnter[i])
      el?.removeEventListener('pointerleave', onLeave)
    })
    scene.traverse((o) => {
      o.geometry?.dispose()
      if (o.material) {
        o.material.map?.dispose()
        o.material.dispose()
      }
    })
    renderer.dispose()
    canvas.remove()
  }
}
