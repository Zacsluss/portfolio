import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Leva } from 'leva'
import { Suspense, useState, useEffect } from 'react'
import { GalaxyBackground } from './components/particles/GalaxyBackground'
import { GPGPUParticles } from './components/particles/GPGPUParticles'
import { SimpleTextParticles } from './components/particles/SimpleTextParticles'
import { Projects } from './components/sections/Projects'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

function App() {
  const showDebug = window.location.hash.includes('debug')
  const [visitorName, setVisitorName] = useState('')
  const [showProjects, setShowProjects] = useState(false)
  const [konamiActivated, setKonamiActivated] = useState(false)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const particleCount = isMobile ? 16384 : 65536
  
  // Konami code easter egg
  useKonamiCode(() => {
    setKonamiActivated(true)
    setTimeout(() => setKonamiActivated(false), 5000)
  })
  
  useEffect(() => {
    // Clear localStorage for testing - remove this line later
    localStorage.removeItem('visitorName')
    
    // Simple prompt after 2 seconds
    const timeoutId = setTimeout(() => {
      const name = prompt('Welcome! What\'s your name?')
      const finalName = name || 'Explorer'
      setVisitorName(finalName)
      // Show projects 3 seconds after name is set
      setTimeout(() => setShowProjects(true), 3000)
    }, 2000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <Leva hidden={!showDebug} />
      
      <Canvas
        className="canvas"
        camera={{ position: [0, 0, 30], fov: 75 }}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          stencil: false,
          depth: true,
          alpha: false
        }}
      >
        {/* Debug tools */}
        {showDebug && <Perf position="top-left" />}
        {showDebug && <Stats />}
        
        {/* Background */}
        <color attach="background" args={['#000814']} />
        <fog attach="fog" args={['#000814', 50, 200]} />
        
        {/* Lights */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ff88" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#0088ff" />
        
        {/* Camera controls */}
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={10}
          maxDistance={100}
          autoRotate={true}
          autoRotateSpeed={0.2}
        />
        
        <Suspense fallback={null}>
          {/* Galaxy Background - 100k particles */}
          <GalaxyBackground count={isMobile ? 30000 : 50000} />
          
          {/* GPGPU Particle System - Temporarily disabled for debugging */}
          {/* <GPGPUParticles /> */}
          
          {/* Text Particles - Using canvas-based approach */}
          {visitorName && (
            <SimpleTextParticles 
              text={visitorName.toUpperCase()} 
              size={80}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="overlay">
        <h1 className="title">
          {visitorName ? `Welcome, ${visitorName}` : 'Particle Universe'}
        </h1>
        <p className="subtitle">
          {particleCount.toLocaleString()} particles running at 60 FPS
        </p>
        <div className="stats">
          <span className="stat-badge">🚀 GPU Accelerated</span>
          <span className="stat-badge">⚡ WebGL 2.0</span>
          <span className="stat-badge">🌌 Real-time Physics</span>
        </div>
        
        {/* Navigation hint */}
        <p className="hint" style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.6 }}>
          Psst... Try the Konami Code: ↑↑↓↓←→←→BA
        </p>
      </div>
      
      {/* Projects Section */}
      {showProjects && <Projects />}
      
      {/* Konami Code Easter Egg */}
      {konamiActivated && (
        <div className="konami-overlay">
          <h1 className="konami-text">🎮 ACHIEVEMENT UNLOCKED!</h1>
          <p className="konami-subtitle">Full Stack Ninja Mode Activated</p>
        </div>
      )}
    </>
  )
}

export default App
