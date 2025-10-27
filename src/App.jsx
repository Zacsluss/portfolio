import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect, lazy } from 'react'
import { ModernStarfield } from './components/particles/ModernStarfield'
import { FluidTextParticles } from './components/particles/FluidTextParticles'
import { SimpleCursor } from './components/ui/SimpleCursor'
import { useKonamiCode } from './hooks/useKonamiCode'
import './App.css'

// Lazy load section components for better code splitting
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About })))
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience })))
const Projects = lazy(() => import('./components/sections/Projects').then(m => ({ default: m.Projects })))
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills })))
const AdditionalWork = lazy(() => import('./components/sections/AdditionalWork').then(m => ({ default: m.AdditionalWork })))
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact })))

// Component to track global mouse position even when hovering over HTML elements
function GlobalMouseTracker() {
  const { size, mouse } = useThree()

  useEffect(() => {
    const handleMouseMove = (event) => {
      // Convert screen coordinates to normalized device coordinates (-1 to 1)
      mouse.x = (event.clientX / size.width) * 2 - 1
      mouse.y = -(event.clientY / size.height) * 2 + 1
    }

    // Listen on document level to catch all mouse movements
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [size, mouse])

  return null
}

function App() {
  const [visitorName, setVisitorName] = useState('Zachary Sluss')
  const [particlesFormed, setParticlesFormed] = useState(false) // Track when particles finish morphing
  const [konamiActivated, setKonamiActivated] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // Hide scroll indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Force browser to calculate scroll height AFTER content renders
  // This ensures scrolling works immediately without needing to click nav first
  useEffect(() => {
    // Wait for React to finish rendering all content, then force height recalculation
    const timer = setTimeout(() => {
      // Force browser to recalculate document height
      document.body.style.height = 'auto'

      // Scroll down 1px then back to top - forces browser to recognize page is scrollable
      window.scrollTo(0, 1)
      window.scrollTo(0, 0)
    }, 100) // Small delay to let all components render

    return () => clearTimeout(timer)
  }, [])

  // Handle wheel events on Canvas to enable page scrolling
  // The Canvas is position:fixed and covers the viewport, so it intercepts wheel events
  // We manually translate wheel events to page scrolls so both drag AND scroll work
  const handleCanvasWheel = (event) => {
    // Scroll the page by the wheel delta
    window.scrollBy({
      top: event.deltaY,
      behavior: 'auto' // Instant scroll, not smooth (for responsiveness)
    })
  }

  // Konami code easter egg
  useKonamiCode(() => {
    setKonamiActivated(true)
    setTimeout(() => setKonamiActivated(false), 5000)
  })

  // Callback when particles finish forming
  const handleParticlesFormed = () => {
    setParticlesFormed(true)
  }

  return (
    <>
      <SimpleCursor />
      
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
        onWheel={handleCanvasWheel}
      >
        {/* Debug tools - removed for production */}
        
        {/* Deep Space Background - Pure void */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 150]} />

        {/* Minimal Deep Space Lighting - distant starlight only */}
        <ambientLight intensity={0.02} color="#1a1a2e" />
        <pointLight position={[50, 50, 50]} intensity={0.1} color="#4a5f8f" />
        <pointLight position={[-50, -50, -50]} intensity={0.08} color="#2d3561" />
        
        {/* Camera controls - orbital camera with mouse drag */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={false}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.5}
          target={[0, 5, 0]}
        />

        {/* Global mouse tracker - updates mouse position even when hovering over HTML elements */}
        <GlobalMouseTracker />

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
                onMorphComplete={handleParticlesFormed}
              />
            </group>
          )}
        </Suspense>
      </Canvas>
      
      {/* Scroll Indicator - Bottom Center */}
      <div className={`scroll-indicator ${particlesFormed && showScrollIndicator ? 'fade-in-1' : ''} ${!showScrollIndicator ? 'hide-scroll' : ''}`}>
        <div className="mouse-icon">
          <div className="mouse-wheel"></div>
        </div>
        <p className="scroll-text">Scroll to explore</p>
      </div>

      {/* Top Right UI - Name Input and Secret Code */}
      <div className={`top-right-overlay ${particlesFormed ? 'fade-in-1' : ''}`}>
        {/* Header */}
        <div className="portfolio-header">
          <h1 className="portfolio-title">Zachary Sluss</h1>
          <p className="portfolio-subtitle">Portfolio</p>
        </div>

        {/* User Instructions */}
        <div className="user-instructions">
          <p className="instruction-item">→ Drag to rotate view</p>
          <p className="instruction-item">→ Scroll to explore content</p>
          <p className="instruction-item">→ Hover over particles</p>
        </div>

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
        <p className="hint easter-egg-hint">
          Secret Code: ↑↑↓↓←→←→BA
        </p>
      </div>

      {/* Sticky Navigation */}
      <nav className={`sticky-nav ${particlesFormed ? 'fade-in-1' : ''}`}>
        <div className="nav-container">
          <a href="#about" className="nav-link">About</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#additional-work" className="nav-link">Additional Work</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </nav>

      {/* Main Content Sections - All fade in after particles */}
      <div className="main-content">
        <Suspense fallback={<div className="section-loading">Loading...</div>}>
          {/* About Section - has 100vh margin to start after hero */}
          <div id="about" className={`content-section ${particlesFormed ? 'fade-in-2' : ''}`}>
            <About />
          </div>

          {/* Experience Section */}
          <div id="experience" className={`content-section ${particlesFormed ? 'fade-in-3' : ''}`}>
            <Experience />
          </div>

          {/* Projects Section */}
          <div id="projects" className={`content-section ${particlesFormed ? 'fade-in-4' : ''}`}>
            <Projects />
          </div>

          {/* Skills Section */}
          <div id="skills" className={`content-section ${particlesFormed ? 'fade-in-5' : ''}`}>
            <Skills />
          </div>

          {/* Additional Work Section */}
          <div id="additional-work" className={`content-section ${particlesFormed ? 'fade-in-6' : ''}`}>
            <AdditionalWork />
          </div>

          {/* Contact Section */}
          <div id="contact" className={`content-section ${particlesFormed ? 'fade-in-7' : ''}`}>
            <Contact />
          </div>
        </Suspense>
      </div>

      {/* Konami effect is now in the particle system */}
    </>
  )
}

export default App
