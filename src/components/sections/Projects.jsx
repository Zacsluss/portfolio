import { useState } from 'react'
import { portfolioData } from '../../data/portfolio-data'
import './Projects.css'

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null)
  const { projects } = portfolioData

  return (
    <div className="projects-wrapper">
      <div className="section-header">
        <h2 className="section-title">Featured Projects</h2>
        <div className="title-line" />
      </div>
      <div className="projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`project-card ${hoveredProject === project.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
            style={{ '--accent-color': project.color }}
          >
            <div className="project-particles"></div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>

            {project.longDescription && (
              <p className="project-long-description">{project.longDescription}</p>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <div className="project-features">
                <p className="features-label">Key Features:</p>
                <ul className="features-list">
                  {project.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="feature-item">
                      <span className="feature-bullet">▹</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="project-tags">
              {project.technologies.map((tech, index) => (
                <span key={index} className="project-tag">{tech}</span>
              ))}
            </div>
            <div className="project-links">
              {project.github && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                  GitHub
                </a>
              )}
              {project.demo && (
                <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                  Live Demo
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}