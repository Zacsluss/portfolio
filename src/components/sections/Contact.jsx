import { portfolioData } from '../../data/portfolio-data'
import './Contact.css'

export function Contact() {
  const { personal } = portfolioData

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <div className="title-line" />
        </div>

        <p className="section-subtitle">
          I'm always open to new opportunities and interesting projects.
          Feel free to reach out if you'd like to connect!
        </p>

        {/* Contact Cards */}
        <div className="contact-cards">
          {/* Email */}
          <a href={`mailto:${personal.email}`} className="contact-card">
            <div className="card-icon">📧</div>
            <div className="card-content">
              <h3 className="card-title">Email</h3>
              <p className="card-description">Send me a message</p>
              <p className="card-value">{personal.email}</p>
            </div>
          </a>

          {/* Phone */}
          {personal.phone && (
            <a href={`tel:${personal.phone}`} className="contact-card">
              <div className="card-icon">📱</div>
              <div className="card-content">
                <h3 className="card-title">Phone</h3>
                <p className="card-description">Give me a call</p>
                <p className="card-value">{personal.phone}</p>
              </div>
            </a>
          )}

          {/* Location */}
          <div className="contact-card">
            <div className="card-icon">📍</div>
            <div className="card-content">
              <h3 className="card-title">Location</h3>
              <p className="card-description">Based in</p>
              <p className="card-value">{personal.location}</p>
            </div>
          </div>
        </div>

        {/* Resume Download */}
        <div className="resume-section">
          <a
            href="/Portfolio2/resume.pdf"
            download
            className="resume-button"
          >
            <span className="resume-icon">📄</span>
            <span>Download My Resume</span>
            <span className="download-icon">⬇️</span>
          </a>
        </div>
      </div>
    </section>
  )
}
