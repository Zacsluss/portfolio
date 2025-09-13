import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Leva } from 'leva'
import { Suspense, useState, useEffect } from 'react'
import { GalaxyBackground } from './components/particles/GalaxyBackground'
import { GPGPUParticles } from './components/particles/GPGPUParticles'
import { FluidTextParticles } from './components/particles/FluidTextParticles'
import { Projects } from './components/sections/Projects'
import { LoadingScreen } from './components/LoadingScreen'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

function App() {
  const showDebug = window.location.hash.includes('debug')
  const [visitorName, setVisitorName] = useState('Zachary Sluss')
  const [showProjects, setShowProjects] = useState(false)
  const [konamiActivated, setKonamiActivated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const particleCount = isMobile ? 16384 : 65536
  
  // Konami code easter egg
  useKonamiCode(() => {
    setKonamiActivated(true)
    setTimeout(() => setKonamiActivated(false), 5000)
  })
  
  useEffect(() => {
    // Show projects after 3 seconds
    const timeoutId = setTimeout(() => {
      setShowProjects(true)
    }, 3000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={() => setIsLoading(false)} />}
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
          <GalaxyBackground count={isMobile ? 30000 : 50000} konamiActivated={konamiActivated} />
          
          {/* GPGPU Particle System - Temporarily disabled for debugging */}
          {/* <GPGPUParticles /> */}
          
          {/* Text Particles - Fluid physics-based approach */}
          {visitorName && (
            <FluidTextParticles 
              key={visitorName}
              text={visitorName.toUpperCase()} 
              size={50}
              konamiActivated={konamiActivated}
            />
          )}
        </Suspense>
      </Canvas>
      
      {/* UI Overlay */}
      <div className="overlay">
        <h1 className="title">
          Welcome to the Particle Universe
        </h1>
        <p className="subtitle">
          {particleCount.toLocaleString()} particles running at 60 FPS
        </p>
        <div className="stats">
          <span className="stat-badge">🚀 GPU Accelerated</span>
          <span className="stat-badge">⚡ WebGL 2.0</span>
          <span className="stat-badge">🌌 Real-time Physics</span>
        </div>
        
        {/* Name Input Field */}
        <div className="name-input-container" style={{ marginTop: '30px' }}>
          <input
            type="text"
            className="name-input"
            placeholder="Enter your name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur() // Trigger blur to apply the change
              }
            }}
            maxLength={20}
          />
          <p className="input-hint">Type your name to see it form in particles</p>
        </div>
        
        {/* Navigation hint */}
        <p className="hint" style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.6 }}>
          Psst... Try the Secret Code: ↑↑↓↓←→←→BA
        </p>
      </div>
      
      {/* Projects Section */}
      {showProjects && <Projects />}
      
      {/* Konami effect is now in the particle system */}
    </>
  )
}

export default App
