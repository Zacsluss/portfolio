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
          <h2 className="section-title">About Me</h2>
          <div className="title-line" />
        </div>

        <div className="about-content">
          {/* Professional Headshot */}
          <div className="headshot-container">
            <div className="headshot-frame">
              <img
                src={import.meta.env.BASE_URL + 'portfolio-images/headshot.jpeg'}
                alt="Zachary Sluss"
                className="headshot-image"
                onError={(e) => {
                  // Fallback to placeholder if image doesn't exist
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
              <div className="headshot-placeholder" style={{display: 'none'}}>
                <div className="placeholder-icon">👤</div>
                <p className="placeholder-text">Add headshot.jpeg</p>
              </div>
            </div>
            <p className="headshot-caption">Zachary Sluss</p>
          </div>

          {/* Bio */}
          <div className="about-bio">
            <p className="bio-text">{personal.bio}</p>

            <div className="location-info">
              <span className="location-icon">📍</span>
              <span>{personal.location}</span>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="quick-facts-card">
            <h3 className="quick-facts-title">Quick Facts</h3>

            <div className="fact-item">
              <p className="fact-label">Current Role</p>
              <p className="fact-value">{personal.title}</p>
            </div>

            <div className="fact-item">
              <p className="fact-label">Location</p>
              <p className="fact-value">{personal.location}</p>
            </div>

            <div className="fact-item">
              <p className="fact-label">Email</p>
              <a
                href={`mailto:${personal.email}`}
                className="fact-link"
              >
                {personal.email}
              </a>
            </div>

            {personal.phone && (
              <div className="fact-item">
                <p className="fact-label">Phone</p>
                <a
                  href={`tel:${personal.phone}`}
                  className="fact-link"
                >
                  {personal.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="about-actions">
          <a href="#contact" className="action-button" onClick={handleSmoothScroll}>
            <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            Get in Touch
          </a>
          <a href="https://github.com/Zacsluss?tab=repositories" target="_blank" rel="noopener noreferrer" className="action-button">
            <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
            View Projects
          </a>
          <a href={import.meta.env.BASE_URL + 'resume.pdf'} download className="action-button">
            <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Resume
          </a>
        </div>

        {/* Social Links */}
        <div className="about-social">
          <a href="https://github.com/Zacsluss" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
          <a href={portfolioData.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
          <a href={`mailto:${personal.email}`} className="social-icon" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
