import { portfolioData } from '../../data/portfolio-data'
import './Skills.css'

// Helper function to map skill proficiency levels to CSS classes for visual styling
// Returns appropriate color class based on expertise level
const getLevelColor = (level) => {
  switch (level) {
    case 'Expert':
      return 'level-expert' // Highest proficiency - typically green
    case 'Advanced':
      return 'level-advanced' // High proficiency - typically blue
    case 'Intermediate':
      return 'level-intermediate' // Moderate proficiency - typically yellow
    case 'Beginner':
      return 'level-beginner' // Learning phase - typically gray
    default:
      return ''
  }
}

export function Skills() {
  // Extract skills data from centralized portfolio data store
  const { skills } = portfolioData

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="title-line" />
        </div>

        <div className="section-intro">
          <p className="section-intro-text">
            My technical foundation spans enterprise architecture, platform integration, and data-driven decision frameworks — built through years of leading complex transformations across global, regulated environments.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skills.map((category, catIndex) => (
            <div key={catIndex} className="skill-category-card">
              <h3 className="category-title">
                <span className="category-dot" />
                {category.category}
              </h3>

              <div className="skills-list">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      {skill.level && (
                        <span className={`skill-level ${getLevelColor(skill.level)}`}>
                          {skill.level}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Skills Legend */}
        <div className="skills-legend">
          <span className="legend-label">Skill Level:</span>
          <div className="legend-item">
            <span className="legend-dot legend-expert" />
            <span>Expert (Primary Platforms)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-advanced" />
            <span>Advanced (Regular Collaboration)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-intermediate" />
            <span>Intermediate (Growing Proficiency)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
