import { useState } from 'react'
import './Projects.css'

const projectsData = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack React & Node.js application with payment integration",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    github: "https://github.com",
    demo: "https://demo.com",
    color: "#00ff88"
  },
  {
    id: 2,
    title: "AI Chat Assistant",
    description: "Machine learning powered chatbot with natural language processing",
    tags: ["Python", "TensorFlow", "NLP", "React"],
    github: "https://github.com",
    demo: "https://demo.com",
    color: "#0088ff"
  },
  {
    id: 3,
    title: "Mobile Fitness App",
    description: "React Native app with workout tracking and social features",
    tags: ["React Native", "Firebase", "Redux", "iOS/Android"],
    github: "https://github.com",
    demo: "https://demo.com",
    color: "#ff006e"
  }
]

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null)

  return (
    <div className="projects-container">
      <h2 className="projects-title">Featured Projects</h2>
      <div className="projects-grid">
        {projectsData.map((project) => (
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
            <div className="project-tags">
              {project.tags.map((tag, index) => (
                <span key={index} className="project-tag">{tag}</span>
              ))}
            </div>
            <div className="project-links">
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                GitHub
              </a>
              <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                Live Demo
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}