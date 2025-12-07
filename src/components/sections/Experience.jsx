import { portfolioData, formatDate, calculateDuration } from '../../data/portfolio-data'
import './Experience.css'

export function Experience() {
  // Pull experience data from centralized portfolio data structure
  const { experience } = portfolioData

  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Experience</h2>
          <div className="title-line" />
        </div>

        {/* Timeline - Visual representation of career progression */}
        <div className="timeline">
          {experience.map((exp) => (
            <div key={exp.id} className="timeline-item"> {/* Each role in career history */}
              {/* Timeline dot */}
              <div className="timeline-dot" />

              {/* Content */}
              <div className="experience-card">
                <div className="card-header">
                  <div className="card-title-group">
                    <h3 className="position-title">{exp.position}</h3>
                    <p className="company-name">{exp.company}</p>
                  </div>
                  <div className="date-info">
                    <span className="date-range">
                      {formatDate(exp.startDate)} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </span>
                    <span className="duration">
                      {calculateDuration(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                </div>

                <p className="description">{exp.description}</p>

                {/* Achievements - Key accomplishments and impact metrics */}
                <ul className="achievements-list">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="achievement-item">
                      <span className="achievement-bullet">▹</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>

                {/* Technologies - Tech stack used in this role */}
                <div className="tech-tags">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
