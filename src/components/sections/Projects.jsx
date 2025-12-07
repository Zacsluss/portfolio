import { useState } from 'react'
import { portfolioData } from '../../data/portfolio-data'
import './Projects.css'

export function Projects() {
  // Track which project card is currently being hovered for interactive effects
  const [hoveredProject, setHoveredProject] = useState(null)
  const { projects } = portfolioData // Extract projects array from portfolio data

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
            onMouseEnter={() => setHoveredProject(project.id)} // Trigger hover state
            onMouseLeave={() => setHoveredProject(null)} // Reset hover state
            style={{ '--accent-color': project.color }} // Dynamic CSS variable for theming
          >
            <div className="project-particles"></div>
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>

            {/* Case Study Format: Problem → Solution → Impact */}
            {project.problem && (
              <div className="case-study-section">
                <h4 className="case-study-label">🎯 The Problem</h4>
                <p className="case-study-text">{project.problem}</p>
              </div>
            )}

            {project.solution && (
              <div className="case-study-section">
                <h4 className="case-study-label">🔧 The Solution</h4>
                <p className="case-study-text">{project.solution}</p>
              </div>
            )}

            {project.impact && (
              <div className="case-study-section case-study-impact">
                <h4 className="case-study-label">📈 The Impact</h4>
                <p className="case-study-text">{project.impact}</p>
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