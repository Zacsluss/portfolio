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
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/🌐%20Portfolio-zacsluss.github.io-2e7d5a?style=for-the-badge"
                alt="Portfolio"
                className="badge-img"
              />
            </a>

            {/* GitHub Badge */}
            <a
              href="https://github.com/Zacsluss"
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/GitHub-@Zacsluss-181717?style=for-the-badge&logo=github&logoColor=white"
                alt="GitHub"
                className="badge-img"
              />
            </a>

            {/* LinkedIn Badge */}
            <a
              href={portfolioData.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/LinkedIn-Zachary_Sluss-064789?style=for-the-badge&logo=linkedin&logoColor=white"
                alt="LinkedIn"
                className="badge-img"
              />
            </a>

            {/* Email Badge */}
            <a
              href={`mailto:${personal.email}`}
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/✉️%20Email-zacharyjsluss@gmail.com-b91c1c?style=for-the-badge"
                alt="Email"
                className="badge-img"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
