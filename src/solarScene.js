import * as THREE from 'three'

const TAU = Math.PI * 2
const SCALE = 5.6 // world units per unit of `o` (orbit diameter) and `p` (planet diameter)

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

function diskTexture(innerRatio) {
  const S = 512, C = S / 2
  const c = document.createElement('canvas')
  c.width = c.height = S
  const g = c.getContext('2d')
  const heat = (f) => (f < 0.25 ? '255,245,215' : f < 0.6 ? '255,170,70' : '210,80,25')
  for (let r = innerRatio * C; r < C; r += 1) { // smooth base glow, hotter near the hole
    const f = (r - innerRatio * C) / (C - innerRatio * C)
    g.strokeStyle = `rgba(${heat(f)},${0.5 * (1 - f) ** 1.5})`
    g.lineWidth = 1.5
    g.beginPath()
    g.arc(C, C, r, 0, TAU)
    g.stroke()
  }
  for (let i = 0; i < 900; i++) { // streaks, so the spin is visible
    const f = Math.random() ** 1.4
    const r = innerRatio * C + f * (C - innerRatio * C)
    const a0 = Math.random() * TAU
    g.strokeStyle = `rgba(${heat(f)},${(0.2 + Math.random() * 0.6) * (1 - f * 0.8)})`
    g.lineWidth = 1 + Math.random() * 2
    g.beginPath()
    g.arc(C, C, r, a0, a0 + 0.1 + Math.random() * 0.8)
    g.stroke()
  }
  return toTexture(c)
}

function haloTexture() { // bright thin ring just outside the black hole, transparent in the middle
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128)
  grad.addColorStop(0, 'rgba(0,0,0,0)')
  grad.addColorStop(0.27, 'rgba(0,0,0,0)')
  grad.addColorStop(0.3, 'rgba(255,240,200,1)')
  grad.addColorStop(0.38, 'rgba(255,150,40,.65)')
  grad.addColorStop(0.62, 'rgba(255,100,20,.18)')
  grad.addColorStop(1, 'rgba(255,100,20,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 256, 256)
  return toTexture(c)
}

function buildStation() {
  const metal = new THREE.MeshStandardMaterial({ color: 0xb8c0cc, metalness: 0.6, roughness: 0.4 })
  const panel = new THREE.MeshStandardMaterial({ color: 0x1b3a7a, metalness: 0.3, roughness: 0.5, emissive: 0x0a1a40 })
  const lamp = new THREE.MeshBasicMaterial({ color: 0xffe9a8 })
  const g = new THREE.Group()
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 16), metal)) // hub

  const wheel = new THREE.Group() // rotating habitat ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.04, 12, 48), metal)
  ring.rotation.x = Math.PI / 2
  wheel.add(ring)
  for (let k = 0; k < 4; k++) {
    const arm = new THREE.Group()
    arm.rotation.y = (k * Math.PI) / 2
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.02, 0.02), metal)
    spoke.position.x = 0.18
    arm.add(spoke)
    wheel.add(arm)
  }
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * TAU
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), lamp)
    w.position.set(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4)
    wheel.add(w)
  }
  g.add(wheel)

  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.03, 0.03), metal)
  beam.position.y = 0.34
  g.add(beam)
  for (const side of [-1, 1]) { // solar panels
    const sp = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.015, 0.26), panel)
    sp.position.set(side * 0.95, 0.34, 0)
    g.add(sp)
  }
  const dish = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.1, 16), metal)
  dish.position.y = 0.46
  g.add(dish)

  g.scale.setScalar(0.85)
  g.rotation.z = 0.12
  g.userData.wheel = wheel
  return g
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
    new THREE.SphereGeometry(0.75, 48, 32),
    new THREE.MeshBasicMaterial({ map: sunTexture() }),
  )
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }))
  glow.scale.setScalar(6)
  scene.add(sun, glow)

  const hits = []

  function addHit(parent, radius, i) { // generous invisible click target, since things keep moving
    const hit = new THREE.Mesh(new THREE.SphereGeometry(radius, 8, 6), new THREE.MeshBasicMaterial({ visible: false }))
    hit.userData.index = i
    parent.add(hit)
    hits.push(hit)
  }

  function buildPlanet(p, i) {
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
    addHit(tilt, Math.max(radius * 1.7, 0.32), i)

    const pts = []
    for (let k = 0; k < 160; k++) pts.push(new THREE.Vector3(Math.cos((k / 160) * TAU) * orbitR, 0, Math.sin((k / 160) * TAU) * orbitR))
    scene.add(new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 }),
    ))
    scene.add(pivot)

    return { p, pivot, holder, tilt, mesh, anchor: tilt, dropBase: radius * (p.ring ? 1.35 : 1.1), scale: 1 }
  }

  function buildHole(p, i) {
    const R = 0.8
    const group = new THREE.Group()
    group.position.set(...p.pos)
    const body = new THREE.Group() // hole + disk; scaled on hover
    group.add(body)

    body.add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000 })))
    const tiltG = new THREE.Group()
    tiltG.rotation.x = -Math.PI / 2 + 0.45 // disk lies flat, tipped a little toward the viewer
    const disk = new THREE.Mesh(
      new THREE.RingGeometry(R * 1.35, R * 3.2, 128),
      new THREE.MeshBasicMaterial({
        map: diskTexture(1.35 / 3.2), side: THREE.DoubleSide, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    )
    tiltG.add(disk)
    body.add(tiltG)
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({
      map: haloTexture(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    }))
    halo.scale.setScalar(R * 7.3)
    body.add(halo)
    addHit(body, R * 2.4, i)

    const station = buildStation() // hovers above the hole
    station.position.y = R * 2.7
    group.add(station)
    scene.add(group)

    return { p, body, disk, station, baseY: station.position.y, anchor: group, dropBase: 1.9, scale: 1 }
  }

  const items = planets.map((p, i) => (p.kind === 'hole' ? buildHole(p, i) : buildPlanet(p, i)))

  // ---- sizing: low sideways angle, as close as possible while everything stays in frame ----
  let width = 1, height = 1
  const probe = new THREE.Vector3()
  const fitPoints = [
    new THREE.Vector3(0, -0.8, SCALE + 0.5),   // front of the outer orbit, plus label room
    new THREE.Vector3(0, 0.5, -SCALE - 0.4),   // back of the outer orbit
    new THREE.Vector3(-SCALE - 0.5, 0, 0),
    new THREE.Vector3(SCALE + 0.5, 0, 0),
  ]
  for (const p of planets) {
    if (p.kind !== 'hole') continue
    const [x, y, z] = p.pos // left / top (station) / right of the black hole
    fitPoints.push(new THREE.Vector3(x - 2.6, y, z), new THREE.Vector3(x, y + 3.2, z), new THREE.Vector3(x + 2.6, y, z))
  }
  const midX = (Math.min(...fitPoints.map((p) => p.x)) + Math.max(...fitPoints.map((p) => p.x))) / 2
  const fits = () => {
    camera.updateMatrixWorld()
    return fitPoints.every((p) => {
      probe.copy(p).project(camera)
      return Math.abs(probe.x) < 0.93 && probe.y > -0.88 && probe.y < 0.9
    })
  }
  function resize() {
    width = container.clientWidth || 1
    height = container.clientHeight || 1
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    const portrait = camera.aspect < 1
    const elev = THREE.MathUtils.degToRad(portrait ? 34 : 14) // sideways view; a bit steeper on phones
    const aim = new THREE.Vector3(midX, 0, portrait ? 0 : 4)  // centre on the whole scene, leaning toward the front
    for (let d = 7; d < 60; d += 0.1) {
      camera.position.set(midX, d * Math.sin(elev), d * Math.cos(elev))
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
  let time = 0
  renderer.setAnimationLoop((now) => {
    const dt = reduceMotion ? 0 : Math.min((now - last) / 1000, 0.1)
    last = now
    time += dt

    sun.rotation.y += dt * 0.05
    for (const [i, it] of items.entries()) {
      it.scale += ((hovered === i ? 1.3 : 1) - it.scale) * 0.15
      if (it.p.kind === 'hole') {
        it.body.scale.setScalar(1 + (it.scale - 1) * 0.5)
        it.disk.rotation.z += dt * 0.5
        it.station.position.y = it.baseY + Math.sin(time * 0.8) * 0.08
        it.station.rotation.y += dt * 0.2
        it.station.userData.wheel.rotation.y += dt * 0.6
      } else {
        it.pivot.rotation.y += (dt * TAU) / it.p.t
        it.holder.rotation.y = -it.pivot.rotation.y
        it.mesh.rotation.y += ((it.p.rev ? -1 : 1) * dt * TAU) / it.p.r
        it.tilt.scale.setScalar(it.scale)
      }
    }
    renderer.render(scene, camera)

    // put each HTML label just under its planet / the black hole
    for (const [i, it] of items.entries()) {
      const el = labels[i]
      if (!el) continue
      it.anchor.getWorldPosition(v)
      v.y -= it.dropBase * it.scale
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
