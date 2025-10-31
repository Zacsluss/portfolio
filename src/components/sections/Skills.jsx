import { portfolioData, calculateSkillLevel } from '../../data/portfolio-data'
import './Skills.css'

const getLevelColor = (level) => {
  switch (level) {
    case 'Expert':
      return 'level-expert'
    case 'Advanced':
      return 'level-advanced'
    case 'Intermediate':
      return 'level-intermediate'
    case 'Beginner':
      return 'level-beginner'
    default:
      return ''
  }
}

export function Skills() {
  const { skills } = portfolioData

  return (
    <section id="skills" className="skills-section">
      <div className="skills-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="title-line" />
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
                {category.skills.map((skill, skillIndex) => {
                  // Use calculated level based on years for consistency
                  // Manual level is kept in data for reference but calculated level ensures accuracy
                  const effectiveLevel = skill.years ? calculateSkillLevel(skill.years) : skill.level

                  return (
                    <div key={skillIndex} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        {effectiveLevel && (
                          <span className={`skill-level ${getLevelColor(effectiveLevel)}`}>
                            {effectiveLevel}
                          </span>
                        )}
                      </div>
                      {skill.years && (
                        <span className="skill-years">{skill.years}y</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="skills-legend">
          <span className="legend-label">Skill Level:</span>
          <div className="legend-item">
            <span className="legend-dot legend-expert" />
            <span>Expert (5+ years)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-advanced" />
            <span>Advanced (3-4 years)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-intermediate" />
            <span>Intermediate (1-2 years)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-beginner" />
            <span>Beginner (&lt;1 year)</span>
          </div>
        </div>
      </div>
    </section>
  )
}
