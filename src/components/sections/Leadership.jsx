import { portfolioData } from '../../data/portfolio-data'
import './Leadership.css'

export function Leadership() {
  const { additionalLinks } = portfolioData

  // Group links by category
  const groupedLinks = additionalLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {})
  const principles = [
    {
      icon: "⚡",
      title: "Empower, Don't Bottleneck",
      description: "Build systems and people that scale beyond me. The best leaders create force multipliers, not dependencies."
    },
    {
      icon: "🤖",
      title: "Automate Relentlessly",
      description: "If it's manual, it's technical debt. Every repeated process is an opportunity to give someone hours of their day back."
    },
    {
      icon: "🎯",
      title: "Align to Business Outcomes",
      description: "Technology for technology's sake is waste. Every platform, every integration, every line of code must drive measurable business value."
    },
    {
      icon: "📊",
      title: "Lead with Data, Decide with Context",
      description: "Analytics inform strategy, but context drives decisions. Numbers tell you what happened — understanding why requires human insight."
    },
    {
      icon: "🌱",
      title: "Lead by Example",
      description: "If I'm asking my team to learn, I'm learning twice as hard. If I'm asking for innovation, I'm shipping personal projects at 60 FPS."
    },
    {
      icon: "🔄",
      title: "Change is the Only Constant",
      description: "Digital transformation isn't a project — it's a mindset. The enterprises that win are the ones that treat change as their competitive advantage."
    }
  ]

  return (
    <section id="leadership" className="leadership-section">
      <div className="leadership-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Leadership & Passions</h2>
          <div className="title-line" />
        </div>

        <div className="leadership-intro">
          <p className="leadership-intro-text">
            I believe the best technology leaders are <strong>force multipliers</strong> — not gatekeepers.
            Throughout my career driving enterprise transformations, I've developed a philosophy that combines
            strategic vision with tactical execution, data-driven decision-making with human-centered design.
          </p>
        </div>

        <div className="principles-grid">
          {principles.map((principle, index) => (
            <div key={index} className="principle-card">
              <div className="principle-icon">{principle.icon}</div>
              <h3 className="principle-title">{principle.title}</h3>
              <p className="principle-description">{principle.description}</p>
            </div>
          ))}
        </div>

        {/* Key Metric Callouts */}
        <div className="leadership-metrics">
          <div className="metric-card">
            <div className="metric-value">40%</div>
            <div className="metric-label">Productivity Gains</div>
            <div className="metric-context">Through strategic automation & process redesign</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">1,000+</div>
            <div className="metric-label">Hours Automated</div>
            <div className="metric-context">Annually across 3,000+ global users</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">100%</div>
            <div className="metric-label">SOX Compliance</div>
            <div className="metric-context">Zero breaches while enabling rapid innovation</div>
          </div>
        </div>

        {/* Passions & Creative Work */}
        <div id="passions" className="passions-section">
          <div className="section-header">
            <h2 className="section-title">Beyond the Enterprise</h2>
            <div className="title-line" />
          </div>

          <div className="section-intro">
            <p className="section-intro-text">
              Multi-passionate about AI/ML, digital art, music production, and 360° drone photography — because curiosity makes better strategists.
            </p>
          </div>

          <div className="categories-container">
            {Object.entries(groupedLinks).map(([category, links]) => (
              <div key={category} className="category-group">
                <h4 className="category-title">{category}</h4>

                <div className="links-grid">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-card"
                    >
                      <div className="link-card-content">
                        {/* Image Thumbnail */}
                        {link.image && (
                          <div className="link-image">
                            <img
                              src={import.meta.env.BASE_URL + link.image}
                              alt={link.title}
                            />
                          </div>
                        )}

                        {/* Content */}
                        <div className="link-text">
                          <h5 className="link-title">
                            {link.title}
                            <span className="external-icon">↗</span>
                          </h5>
                          <p className="link-description">{link.description}</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
