import { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { planets } from '../planets'
import { createSolarScene } from '../solarScene'

export default function SolarSystem() {
  const mount = useRef(null)
  const labels = useRef([])
  const navigate = useNavigate()

  useEffect(() => {
    return createSolarScene({
      container: mount.current,
      planets,
      labels: labels.current,
      onSelect: (path) => navigate(`/${path}`),
    })
  }, [navigate])

  return (
    <main>
      <h1>Isaac Gonzalez</h1>
      <p className="hint">Pick a planet to explore</p>
      <div className="scene" ref={mount}>
        {/* the labels are real links: they sit under each planet and keep the page keyboard-accessible */}
        <nav className="labels" aria-label="Portfolio pages">
          {planets.map((p, i) => (
            <Link key={p.path} to={`/${p.path}`} className="planet-label" ref={(el) => (labels.current[i] = el)}>
              {p.label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  )
}
