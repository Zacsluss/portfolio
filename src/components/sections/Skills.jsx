import { portfolioData } from '../../data/portfolio-data'
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
                    {skill.years && (
                      <span className="skill-years">{skill.years}y</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="skills-legend">
          <span className="legend-label">Skill Level:</span>
          <div className="legend-item">
            <span className="legend-dot legend-expert" />
            <span>Expert</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-advanced" />
            <span>Advanced</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-intermediate" />
            <span>Intermediate</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-beginner" />
            <span>Beginner</span>
          </div>
        </div>
      </div>
    </section>
  )
}
