import { useState } from 'react'
import { site, projects, education, workExperience, socialProfiles } from './content'
import { ProfileSocialLinks } from './ProfileSocialLinks'
import { ProjectGalleryModal } from './ProjectGalleryModal'
import { StatsGrid } from './StatsGrid'
import { TechIcons } from './TechIcons'
import { ThemeSphere } from './ThemeSphere'
import { useAccentTheme } from './useAccentTheme'
import { WorkModal } from './WorkModal'
import bgVideo from './assets/video/BG-Animation.mp4'

type Job = (typeof workExperience)[number]
type Project = (typeof projects)[number]

function App() {
  const { presetId, setPresetId } = useAccentTheme()
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  return (
    <div className="app">
      <div className="bg" aria-hidden="true">
        <video className="bg-video" autoPlay muted loop playsInline preload="auto">
          <source src={bgVideo} type="video/mp4" />
        </video>
        <div className="bg-overlay" />
      </div>

      <div className="page">
        <header className="header">
          <a href="#" className="logo">
            Welcome to my Portfolio
          </a>
          <div className="header-actions">
            <nav className="nav" aria-label="Primary">
              <a href="#education">Education</a>
              <a href="#work">Work</a>
              <a href="#projects">Projects</a>
              <a href="#contact">Contact</a>
            </nav>
          </div>
        </header>

        <main>
          <section className="hero" aria-labelledby="intro-heading">
            <div className="hero-layout">
              <div className="hero-summary">
                <h1 id="intro-heading" className="headline">
                  {site.tagline}
                </h1>
                <p className="hero-prose">{site.summary}</p>
                <StatsGrid />
                <TechIcons />
              </div>

              <aside className="hero-profile" aria-label="Profile">
                <img
                  className="hero-photo"
                  src={site.photo}
                  alt={site.name}
                  loading="eager"
                  decoding="async"
                />
                <p className="hero-name">{site.name}</p>
                <ProfileSocialLinks items={socialProfiles} />
              </aside>
            </div>
          </section>

          <section id="education" className="section" aria-labelledby="education-heading">
            <h2 id="education-heading" className="section-title">
              Education
            </h2>
            <ul className="education-list">
              {education.map((e) => (
                <li key={e.school} className="education-item">
                  <p className="education-degree">{e.degree}</p>
                  <p className="education-school">{e.school}</p>
                  <p className="education-years">{e.years}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="work" className="section" aria-labelledby="work-heading">
            <h2 id="work-heading" className="section-title">
              Work Experience
            </h2>
            <ul className="work-grid">
              {workExperience.map((job) => (
                <li key={job.company + job.period}>
                  <button
                    className="work-card"
                    onClick={() => setActiveJob(job)}
                    aria-haspopup="dialog"
                  >
                    <span className="work-card-badge">View Details</span>
                    <span className="work-role">{job.role}</span>
                    <span className="work-company">{job.company}</span>
                    <span className="work-period">{job.period}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section id="projects" className="section" aria-labelledby="projects-heading">
            <h2 id="projects-heading" className="section-title">
              Projects
            </h2>
            <ul className="proj-grid">
              {projects.map((p) => (
                <li key={p.name}>
                  <button
                    className="proj-card"
                    onClick={() => setActiveProject(p)}
                    aria-haspopup="dialog"
                  >
                    <div className="proj-card-cover">
                      <img src={p.cover} alt={p.name} loading="lazy" draggable={false} />
                      <div className="proj-card-overlay">
                        <span className="proj-card-view">View Gallery</span>
                      </div>
                    </div>
                    <div className="proj-card-body">
                      <span className="proj-card-type">{p.type}</span>
                      <span className="proj-card-name">{p.name}</span>
                      <span className="proj-card-tech">{p.tech}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section id="contact" className="section section--contact" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="section-title">Contact</h2>

            <div className="contact-card">
              <div className="contact-card-left">
                <p className="contact-headline">Let's work together</p>
                <p className="contact-sub">
                  Open to full-time roles, freelance projects, and collaborations.
                  Feel free to reach out — I'd love to connect.
                </p>
                <p className="contact-email">{site.email}</p>
              </div>

              <div className="contact-actions">
                <a
                  href={`mailto:${site.email}`}
                  className="contact-btn contact-btn--primary"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  Send an Email
                </a>
                <a
                  href={site.cv}
                  download
                  className="contact-btn contact-btn--secondary"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download CV
                </a>
              </div>
            </div>

            {site.links.some(l => !l.href.includes('yourusername')) && (
              <ul className="contact-links">
                {site.links.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} target="_blank" rel="noreferrer" className="contact-link">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <footer className="footer">
          <span>© {new Date().getFullYear()} {site.name}</span>
        </footer>
      </div>

      <WorkModal job={activeJob} onClose={() => setActiveJob(null)} />
      <ProjectGalleryModal project={activeProject} onClose={() => setActiveProject(null)} />
      <ThemeSphere value={presetId} onChange={setPresetId} />
    </div>
  )
}

export default App
