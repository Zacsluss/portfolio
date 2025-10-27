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
            <p className="headshot-role">Lead CRM Systems Analyst</p>
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
      </div>
    </section>
  )
}
