import { frameworks, techLogos, projects, socials, email, aboutText, education, research, experience, leadership, awards, skills } from '../data'

function Section({ title, children }) {
  return (
    <section className="section">
      {title && <h2>{title}</h2>}
      {children}
    </section>
  )
}

function Entry({ title, org, place, dates, bullets }) {
  return (
    <article className="entry">
      <header>
        <h3>{title}</h3>
        <span className="dates">{dates}</span>
      </header>
      <p className="org">{[org, place].filter(Boolean).join(' · ')}</p>
      {bullets && <ul>{bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
    </article>
  )
}

function Chips({ title, items }) {
  return (
    <div className="skill-group">
      <h3>{title}</h3>
      <ul className="chips">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  )
}

function LogoRow({ items }) {
  return (
    <div className="logos-container">
      {items.map((l) => (
        <div key={l.name}><img src={l.src || l.img} className="logo" alt={`${l.name} logo`} /></div>
      ))}
    </div>
  )
}

export const Frameworks = () => (
  <>
    <LogoRow items={frameworks} />
    <Chips title="AI / ML" items={skills.aiml} />
    <Chips title="Frameworks & Tools" items={skills.tools} />
  </>
)
export const Technologies = () => (
  <>
    <LogoRow items={techLogos} />
    <Chips title="Languages" items={skills.languages} />
    <Chips title="Robotics & Embedded" items={skills.robotics} />
  </>
)

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
    <>
      <div className="logos-container">
        {socials.map((s) => (
          <a key={s.name} href={s.src} target="_blank" rel="noreferrer">
            <img src={s.img} className="logo" alt={`${s.name} logo`} />
          </a>
        ))}
      </div>
      <p className="contact-email">
        <a href={`mailto:${email}`}>{email}</a>
      </p>
    </>
  )
}

export const About = () => (
  <div className="prose">
    {aboutText.map((t) => <p key={t}>{t}</p>)}
  </div>
)

export const Education = () => <Section>{education.map((e) => <Entry key={e.title} {...e} />)}</Section>

export const Research = () => (
  <Section>
    <Entry {...research} />
  </Section>
)

export const Experience = () => (
  <>
    <Section title="Experience">{experience.map((e) => <Entry key={e.title} {...e} />)}</Section>
    <Section title="Leadership">{leadership.map((e) => <Entry key={e.title} {...e} />)}</Section>
    <Section title="Awards">
      {awards.map((a) => (
        <article className="entry award" key={a.name}>
          <h3>{a.name}</h3>
          <span className="dates">{a.date}</span>
        </article>
      ))}
    </Section>
  </>
)

// Placeholder for pages that don't have content yet - replace in App.jsx
export const ComingSoon = () => <p className="soon">This page is still being built. Content coming soon.</p>
