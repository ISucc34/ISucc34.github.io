import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { planets } from './planets'
import SolarSystem from './pages/SolarSystem'
import { Frameworks, Technologies, Projects, Contact, ComingSoon } from './pages/Pages'
import './App.css'

// Which component each planet's page shows. Swap ComingSoon for real content later.
const content = {
  frameworks: Frameworks,
  technologies: Technologies,
  projects: Projects,
  contact: Contact,
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<SolarSystem />} />
      {planets.map((p) => {
        const Content = content[p.path] || ComingSoon
        return (
          <Route key={p.path} path={`/${p.path}`} element={
            <main>
              <Link to="/" className="back">← Back to the solar system</Link>
              <h1>{p.title || p.label}</h1>
              <Content />
            </main>
          } />
        )
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
