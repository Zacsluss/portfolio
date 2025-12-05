import { useState } from 'react'
import { portfolioData } from '../../data/portfolio-data'
import './About.css'

export function About() {
  const { personal } = portfolioData
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height
    setMousePos({ x, y })
  }

  const handleSmoothScroll = (event) => {
    event.preventDefault()
    const targetId = event.currentTarget.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  return (
    <section
      id="about"
      className="about-section"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax grid background */}
      <div
        className="about-grid"
        style={{
          transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)`
        }}
      />

      <div className="about-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">
            <span className="section-arrow">▼</span> About & Connect
          </h2>
          <div className="title-line" />
        </div>

        {/* Main About Content */}
        <div className="about-main-content">
          <p className="about-main-text">
            I'm a <strong>Principal CRM & Enterprise Platforms Solutions Architect</strong> with expertise in managing multi-million-dollar
            Salesforce ecosystems and enterprise integrations across global deployments. I'm passionate about building projects
            that explore computational physics, algorithm optimization, and performance engineering.
          </p>
          <p className="about-tagline">Always learning, always building.</p>
        </div>

        {/* Let's Connect Section */}
        <div className="connect-section">
          <h3 className="connect-title">Let's Connect</h3>

          <div className="badge-container">
            {/* Portfolio Badge */}
            <a
              href="https://zacsluss.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link portfolio-badge"
            >
              <span className="badge-icon">🌐</span>
              <span className="badge-label">Portfolio</span>
              <span className="badge-value">zacsluss.github.io</span>
            </a>

            {/* GitHub Badge */}
            <a
              href="https://github.com/Zacsluss"
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link github-badge"
            >
              <span className="badge-label">GitHub</span>
              <span className="badge-value">@Zacsluss</span>
            </a>

            {/* LinkedIn Badge */}
            <a
              href={portfolioData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link linkedin-badge"
            >
              <span className="badge-label">LinkedIn</span>
              <span className="badge-value">Zachary Sluss</span>
            </a>

            {/* Email Badge */}
            <a
              href={`mailto:${personal.email}`}
              className="badge-link email-badge"
            >
              <span className="badge-icon">✉️</span>
              <span className="badge-label">Email</span>
              <span className="badge-value">zacharyjsluss@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="about-footer">
          <p>Found this helpful? Give it a ⭐ to show support!</p>
          <p>Want to contribute? See <a href="#contributing" className="footer-link">contributing guidelines</a> above.</p>
          <p>Need help? Feel free to email me.</p>
        </div>
      </div>
    </section>
  )
}
