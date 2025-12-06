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
            By day, I work as a <strong>Principal CRM & Enterprise Platforms Solutions Architect</strong>, managing multi-million-dollar
            Salesforce ecosystems and enterprise integrations across 20+ countries. By night, I build projects like this.
          </p>
          <p className="about-tagline"><strong>Always learning, always building.</strong></p>
        </div>

        {/* Let's Connect Section */}
        <div className="connect-section">
          <h3 className="connect-title">Let's Connect</h3>

          <div className="badge-container">
            <a
              href="https://zacsluss.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/Portfolio-zacsluss.github.io-2e7d5a?style=for-the-badge&logo=githubpages&logoColor=white"
                alt="Portfolio"
                className="badge-img"
              />
            </a>
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
            <a
              href={`mailto:${personal.email}`}
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/Email-zacharyjsluss@gmail.com-b91c1c?style=for-the-badge&logo=gmail&logoColor=white"
                alt="Email"
                className="badge-img"
              />
            </a>
            <a
              href={import.meta.env.BASE_URL + 'resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="badge-link"
            >
              <img
                src="https://img.shields.io/badge/Resume-Download_PDF-7c3aed?style=for-the-badge&logo=adobeacrobatreader&logoColor=white"
                alt="Resume"
                className="badge-img"
              />
            </a>
          </div>
        </div>

        {/* Footer Text */}
        <div className="about-footer">
          <p><strong>Found this helpful?</strong> Give it a ⭐ to show support!</p>
          <p><strong>Want to contribute?</strong> See <a href="#contributing" className="footer-link">contributing guidelines</a> above.</p>
          <p><strong>Need help?</strong> <a href="https://github.com/Zacsluss/portfolio/issues" className="footer-link">Open an issue</a> or email me.</p>
        </div>
      </div>
    </section>
  )
}
