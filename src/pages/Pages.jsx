import { frameworks, techLogos, projects, socials } from '../data'

function LogoRow({ items }) {
  return (
    <div className="logos-container">
      {items.map((l) => (
        <div key={l.name}><img src={l.src || l.img} className="logo" alt={`${l.name} logo`} /></div>
      ))}
    </div>
  )
}

export const Frameworks = () => <LogoRow items={frameworks} />
export const Technologies = () => <LogoRow items={techLogos} />

export function Projects() {
  return (
    <div className="projects">
      {projects.map((p) => (
        <a key={p.name} className="project-card" href={p.src} target="_blank" rel="noreferrer">
          {p.img && <img className="project-image" src={p.img} alt="" />}
          <div className="project-content">
            <h3>{p.name}</h3>
            <p>{p.desc}</p>
          </div>
        </a>
      ))}
    </div>
  )
}

export function Contact() {
  return (
    <div className="logos-container">
      {socials.map((s) => (
        <a key={s.name} href={s.src} target="_blank" rel="noreferrer">
          <img src={s.img} className="logo" alt={`${s.name} logo`} />
        </a>
      ))}
    </div>
  )
}

// Placeholder for pages that don't have content yet - replace in App.jsx
export const ComingSoon = () => <p className="soon">This planet hasn't been explored yet. Content coming soon.</p>
