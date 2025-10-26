import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { Leva } from 'leva'
import { Suspense, useState, useEffect } from 'react'
import { ModernStarfield } from './components/particles/ModernStarfield'
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
        camera={{ position: [0, 0, 20], fov: 85 }}
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
        
        {/* Deep Space Background - Pure void */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 150]} />

        {/* Minimal Deep Space Lighting - distant starlight only */}
        <ambientLight intensity={0.02} color="#1a1a2e" />
        <pointLight position={[50, 50, 50]} intensity={0.1} color="#4a5f8f" />
        <pointLight position={[-50, -50, -50]} intensity={0.08} color="#2d3561" />
        
        {/* Camera controls - orbital camera with mouse drag */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={true}
          minDistance={15}
          maxDistance={50}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          target={[0, 5, 0]}
        />
        
        <Suspense fallback={null}>
          {/* Ultra-Modern Starfield - UE5-style with bokeh, motion blur, depth of field */}
          <ModernStarfield count={isMobile ? 10000 : 30000} speed={2.0} />

          {/* Text Particles - Positioned higher on screen */}
          {visitorName && (
            <group position={[0, 5, 0]}>
              <FluidTextParticles
                key={visitorName}
                text={visitorName.toUpperCase()}
                size={50}
                konamiActivated={konamiActivated}
              />
            </group>
          )}
        </Suspense>
      </Canvas>
      
      {/* Top Right UI - Name Input and Secret Code */}
      <div className="top-right-overlay">
        <div className="name-input-container">
          <input
            type="text"
            className="name-input"
            placeholder="Enter your name"
            value={visitorName}
            onChange={(e) => setVisitorName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur()
              }
            }}
            maxLength={20}
          />
          <p className="input-hint">Type your name to see it form in particles</p>
        </div>

        {/* Easter egg hint */}
        <p className="hint" style={{ marginTop: '15px', fontSize: '0.85rem', opacity: 0.5 }}>
          Secret Code: ↑↑↓↓←→←→BA
        </p>
      </div>
      
      {/* Projects Section */}
      {showProjects && <Projects />}
      
      {/* Konami effect is now in the particle system */}
    </>
  )
}

export default App
