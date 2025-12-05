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

          <div className="connect-buttons">
            {/* Portfolio Button */}
            <a
              href="https://zacsluss.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="connect-button portfolio-btn"
            >
              <span className="btn-icon">🌐</span>
              <span className="btn-label">PORTFOLIO</span>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/Zacsluss"
              target="_blank"
              rel="noopener noreferrer"
              className="connect-button github-btn"
            >
              <span className="btn-label">GITHUB</span>
              <span className="btn-username">@ZACSLUSS</span>
            </a>

            {/* LinkedIn Button */}
            <a
              href={portfolioData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="connect-button linkedin-btn"
            >
              <span className="btn-label">LINKEDIN</span>
              <span className="btn-username">ZACHARY SLUSS</span>
            </a>
          </div>

          <div className="connect-buttons">
            {/* Email Button */}
            <a
              href={`mailto:${personal.email}`}
              className="connect-button email-btn"
            >
              <span className="btn-icon">✉</span>
              <span className="btn-label">EMAIL</span>
              <span className="btn-value">{personal.email.toUpperCase()}</span>
            </a>

            {/* Resume Button */}
            <a
              href={import.meta.env.BASE_URL + 'resume.pdf'}
              download
              className="connect-button resume-btn"
            >
              <span className="btn-icon">📄</span>
              <span className="btn-label">RESUME</span>
              <span className="btn-value">DOWNLOAD PDF</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
