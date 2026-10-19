// One entry per planet. `path` is the page it links to (#/path).
// o = orbit size, p = planet size, t = seconds per orbit, a = start angle (deg),
// r = seconds per spin (rev = spins backwards), tilt = axis tilt (radians), ring = Saturn-style ring.
// base/bands/spots describe the painted surface:
//   bands = [y0, y1, colour]            horizontal stripes (0 = north pole, 1 = south pole)
//   spots = [x, y, radiusX, radiusY, colour]   soft blobs
export const planets = [
  { path: 'about', label: 'About Me', o: 0.24, p: 0.026, t: 40, a: 20, r: 40, tilt: 0, base: '#8c857d',
    spots: [[.2,.35,.03,.05,'#5b5650'], [.5,.6,.04,.06,'#a49d94'], [.75,.4,.03,.04,'#5b5650'], [.35,.75,.025,.04,'#5b5650'], [.9,.55,.03,.05,'#5b5650'], [.1,.7,.03,.05,'#a49d94']] },
  { path: 'frameworks', label: 'Frameworks', title: 'Libraries & Frameworks', o: 0.34, p: 0.036, t: 60, a: 140, r: 60, rev: true, tilt: 3.0, base: '#d9a24c',
    bands: [[.15,.3,'rgba(243,208,142,.5)'], [.5,.7,'rgba(185,127,53,.45)']],
    spots: [[.3,.35,.14,.08,'#f3d08e'], [.65,.6,.16,.08,'#b97f35'], [.5,.2,.12,.05,'#f3d08e'], [.85,.5,.12,.07,'#f3d08e']] },
  { path: 'contact', label: 'Contact', title: 'Contact and Socials', o: 0.44, p: 0.040, t: 80, a: 250, r: 14, tilt: 0.41, base: '#1f6fd1',
    spots: [[.22,.38,.09,.16,'#2f9a4f'], [.55,.55,.08,.14,'#3aa65a'], [.78,.35,.07,.12,'#2f9a4f'], [.4,.3,.05,.06,'#3aa65a'],
            [.7,.3,.1,.04,'rgba(255,255,255,.7)'], [.3,.65,.1,.035,'rgba(255,255,255,.6)'], [.9,.7,.08,.03,'rgba(255,255,255,.6)'],
            [.5,0,.6,.08,'#f0f6ff'], [.5,1,.6,.08,'#f0f6ff']] },
  { path: 'technologies', label: 'Technologies', o: 0.54, p: 0.030, t: 100, a: 330, r: 16, tilt: 0.44, base: '#c1440e',
    spots: [[.3,.5,.1,.12,'#7a2a0a'], [.65,.35,.07,.09,'#e07a4a'], [.8,.62,.08,.08,'#7a2a0a'], [.5,0,.6,.07,'#f0e0d8'], [.5,1,.6,.07,'#f0e0d8']] },
  { path: 'projects', label: 'Projects', o: 0.67, p: 0.082, t: 150, a: 60, r: 8, tilt: 0.05, base: '#c99a63',
    bands: [[.12,.2,'rgba(120,70,40,.55)'], [.3,.38,'rgba(150,90,50,.45)'], [.46,.56,'rgba(120,70,40,.5)'], [.66,.74,'rgba(150,90,50,.45)'], [.82,.88,'rgba(120,70,40,.5)']],
    spots: [[.4,.62,.07,.05,'#b5472b']] },
  { path: 'experience', label: 'Experience', o: 0.81, p: 0.058, t: 190, a: 200, r: 9, tilt: 0.47, ring: true, base: '#d4b36a',
    bands: [[.2,.3,'rgba(150,110,50,.4)'], [.45,.55,'rgba(150,110,50,.35)'], [.7,.78,'rgba(150,110,50,.4)']],
    spots: [[.6,.4,.08,.03,'#f1dca0']] },
  { path: 'education', label: 'Education', o: 0.92, p: 0.044, t: 240, a: 290, r: 13, rev: true, tilt: 1.4, base: '#66c8cf',
    spots: [[.35,.45,.12,.05,'#a5ecec'], [.7,.65,.1,.05,'#4aa7b0']] },
  { path: 'blog', label: 'Blog', o: 1.0, p: 0.044, t: 300, a: 110, r: 12, tilt: 0.5, base: '#4a63d6',
    spots: [[.3,.4,.08,.07,'#1f2f94'], [.65,.6,.12,.03,'rgba(255,255,255,.55)']] },
]
