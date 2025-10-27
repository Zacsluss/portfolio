import { useEffect, useState } from 'react'
import './LoadingScreen.css'

export function LoadingScreen({ onLoadComplete }) {
  const [progress, setProgress] = useState(0)
  const [particles, setParticles] = useState([])
  
  useEffect(() => {
    // Create loading particles
    const particleArray = []
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 2
      })
    }
    setParticles(particleArray)
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => onLoadComplete(), 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)
    
    return () => clearInterval(interval)
  }, [onLoadComplete])
  
  return (
    <div className={`loading-screen ${progress >= 100 ? 'fade-out' : ''}`}>
      {/* Loading content */}
      <div className="loading-content">
        <h1 className="loading-title">INITIALIZING UNIVERSE</h1>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-progress">{Math.round(progress)}%</p>
        <div className="loading-stats">
          <span className="loading-stat">Loading {(65536 * progress / 100).toFixed(0)} particles</span>
          <span className="loading-stat">Preparing shaders</span>
          <span className="loading-stat">Initializing WebGL</span>
        </div>
      </div>
    </div>
  )
}