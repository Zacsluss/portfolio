import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect, lazy } from 'react'
import { ModernStarfield } from './components/particles/ModernStarfield'
import { FluidTextParticles } from './components/particles/FluidTextParticles'
import { SimpleCursor } from './components/ui/SimpleCursor'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { Section } from './components/ui/Section'
import { useKonamiCode } from './hooks/useKonamiCode'
import { getOptimalParticleCount, getOptimalPixelRatio } from './utils/device'
import { sanitizeName } from './utils/sanitize'
import { PARTICLE_CONFIG, ANIMATION, CAMERA, LIGHTING, CONTROLS } from './config/constants'
import './App.css'

// Lazy load section components for better code splitting
const About = lazy(() => import('./components/sections/About').then(m => ({ default: m.About })))
const Skills = lazy(() => import('./components/sections/Skills').then(m => ({ default: m.Skills })))
const Experience = lazy(() => import('./components/sections/Experience').then(m => ({ default: m.Experience })))
const Leadership = lazy(() => import('./components/sections/Leadership').then(m => ({ default: m.Leadership })))
const Contact = lazy(() => import('./components/sections/Contact').then(m => ({ default: m.Contact })))

/**
 * Component to track global mouse position even when hovering over HTML elements
 * Updates Three.js mouse state for particle interaction physics
 */
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
  // Core application state management
  const [visitorName, setVisitorName] = useState(PARTICLE_CONFIG.DEFAULT_TEXT) // Dynamic text for particle animation
  const [particlesFormed, setParticlesFormed] = useState(false) // Tracks when particle formation animation completes
  const [konamiActivated, setKonamiActivated] = useState(false) // Easter egg activation state
  const [showScrollIndicator, setShowScrollIndicator] = useState(true) // Controls visibility of scroll hint

  // Hide scroll indicator when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > ANIMATION.SCROLL_HIDE_THRESHOLD_PX) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Smooth scroll handler for navigation links
  // Provides seamless navigation between portfolio sections
  const handleSmoothScroll = (event) => {
    event.preventDefault()
    const targetId = event.currentTarget.getAttribute('href').substring(1) // Extract section ID from href
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  // Handle wheel events at window level with requestAnimationFrame throttling
  // Canvas is position:fixed but content has z-index:10, so we need window-level handler
  useEffect(() => {
    let scrollPending = false

    const handleWheel = (event) => {
      if (!scrollPending) {
        scrollPending = true
        requestAnimationFrame(() => {
          window.scrollBy(0, event.deltaY)
          scrollPending = false
        })
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  // Konami code easter egg with configurable duration
  useKonamiCode(() => {
    setKonamiActivated(true)
    setTimeout(() => setKonamiActivated(false), ANIMATION.KONAMI_DURATION_MS)
  })

  // Callback when particles finish forming
  const handleParticlesFormed = () => {
    setParticlesFormed(true)
  }

  // Handle name input with sanitization
  const handleNameChange = (e) => {
    const sanitized = sanitizeName(e.target.value)
    setVisitorName(sanitized || PARTICLE_CONFIG.DEFAULT_TEXT)
  }

  return (
    <ErrorBoundary>
      <SimpleCursor />

      <Canvas
        className="canvas"
        camera={{ position: CAMERA.POSITION, fov: CAMERA.FOV }}
        gl={{
          powerPreference: "high-performance",
          antialias: false,
          stencil: false,
          depth: true,
          alpha: false,
          pixelRatio: getOptimalPixelRatio()
        }}
      >
        {/* Deep Space Background - Pure void */}
        <color attach="background" args={['#000000']} />
        <fog attach="fog" args={['#000000', 30, 150]} />

        {/* Minimal Deep Space Lighting - distant starlight only */}
        <ambientLight intensity={LIGHTING.AMBIENT_INTENSITY} color={LIGHTING.AMBIENT_COLOR} />
        <pointLight
          position={LIGHTING.POINT_LIGHT_1.position}
          intensity={LIGHTING.POINT_LIGHT_1.intensity}
          color={LIGHTING.POINT_LIGHT_1.color}
        />
        <pointLight
          position={LIGHTING.POINT_LIGHT_2.position}
          intensity={LIGHTING.POINT_LIGHT_2.intensity}
          color={LIGHTING.POINT_LIGHT_2.color}
        />

        {/* Camera controls - orbital camera with mouse drag */}
        <OrbitControls
          enableZoom={CONTROLS.ENABLE_ZOOM}
          enablePan={CONTROLS.ENABLE_PAN}
          enableRotate={CONTROLS.ENABLE_ROTATE}
          autoRotate={CONTROLS.AUTO_ROTATE}
          enableDamping={CONTROLS.ENABLE_DAMPING}
          dampingFactor={CONTROLS.DAMPING_FACTOR}
          rotateSpeed={CONTROLS.ROTATE_SPEED}
          target={CONTROLS.TARGET}
        />

        {/* Global mouse tracker - updates mouse position even when hovering over HTML elements */}
        <GlobalMouseTracker />

        <Suspense fallback={null}>
          {/* Ultra-Modern Starfield - UE5-style with bokeh, motion blur, depth of field */}
          <ModernStarfield count={getOptimalParticleCount()} speed={2.0} />

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

      {/* Top Left UI - Name Input and Secret Code */}
      <div className={`top-right-overlay ${particlesFormed ? 'fade-in-1' : ''}`}>
        {/* Header */}
        <div className="portfolio-header">
          <h1 className="portfolio-title">Zachary Sluss</h1>
          <p className="portfolio-subtitle">Welcome to my Portfolio!</p>
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
            onChange={handleNameChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur()
              }
            }}
            maxLength={PARTICLE_CONFIG.MAX_TEXT_LENGTH}
          />
          <p className="input-hint">Type your name and press ENTER to see it form in particles</p>
        </div>

        {/* Easter egg hint */}
        <p className="hint easter-egg-hint">
          Secret Code: ↑↑↓↓←→←→BA
        </p>
      </div>

      {/* Sticky Navigation */}
      <nav className={`sticky-nav ${particlesFormed ? 'fade-in-1' : ''}`}>
        <div className="nav-container">
          <a href="#about" className="nav-link" onClick={handleSmoothScroll}>About</a>
          <a href="#skills" className="nav-link" onClick={handleSmoothScroll}>Skills</a>
          <a href="#experience" className="nav-link" onClick={handleSmoothScroll}>Experience</a>
          <a href="#leadership" className="nav-link" onClick={handleSmoothScroll}>Leadership</a>
          <a href="#passions" className="nav-link" onClick={handleSmoothScroll}>Beyond the Enterprise</a>
          <a href="#contact" className="nav-link" onClick={handleSmoothScroll}>Contact</a>
        </div>
      </nav>

      {/* Main Content Sections - All fade in after particles */}
      <div className="main-content">
        <Suspense fallback={<div className="section-loading">Loading...</div>}>
          <Section id="about" fadeDelay={2} visible={particlesFormed}>
            <About />
          </Section>

          <Section id="skills" fadeDelay={3} visible={particlesFormed}>
            <Skills />
          </Section>

          <Section id="experience" fadeDelay={4} visible={particlesFormed}>
            <Experience />
          </Section>

          <Section id="leadership" fadeDelay={5} visible={particlesFormed}>
            <Leadership />
          </Section>

          <Section id="contact" fadeDelay={6} visible={particlesFormed}>
            <Contact />
          </Section>
        </Suspense>
      </div>
    </ErrorBoundary>
  )
}

export default App
