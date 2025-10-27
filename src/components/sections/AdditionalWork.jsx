import { portfolioData } from '../../data/portfolio-data'
import './AdditionalWork.css'

export function AdditionalWork() {
  const { additionalLinks } = portfolioData

  // Group links by category
  const groupedLinks = additionalLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = []
    }
    acc[link.category].push(link)
    return acc
  }, {})

  return (
    <section id="additional-work" className="additional-work-section">
      <div className="additional-work-container">
        {/* Section Header */}
        <div className="section-header">
          <h2 className="section-title">Additional Work</h2>
          <div className="title-line" />
        </div>

        <p className="section-subtitle">
          Explore my diverse portfolio spanning technology, creative arts, and aerial photography
        </p>

        {/* Categories */}
        <div className="categories-container">
          {Object.entries(groupedLinks).map(([category, links]) => (
            <div key={category} className="category-group">
              <h3 className="category-title">{category}</h3>

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
                            src={link.image}
                            alt={link.title}
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="link-text">
                        <h4 className="link-title">
                          {link.title}
                          <span className="external-icon">↗</span>
                        </h4>
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
    </section>
  )
}
