import { useEffect, useRef } from 'react'
import './GlassCursor.css'

export function GlassCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const cursorPos = useRef({ x: -9999, y: -9999 }) // Start FAR offscreen
  const cursorTarget = useRef({ x: -9999, y: -9999 }) // Start FAR offscreen
  const hasMovedMouse = useRef(false) // Track if mouse has moved yet

  useEffect(() => {
    const handleMouseMove = (e) => {
      // On FIRST mouse move, initialize position to current mouse
      if (cursorTarget.current.x === -9999) {
        cursorTarget.current.x = e.clientX
        cursorTarget.current.y = e.clientY
        cursorPos.current.x = e.clientX
        cursorPos.current.y = e.clientY
        hasMovedMouse.current = true
      } else {
        cursorTarget.current.x = e.clientX
        cursorTarget.current.y = e.clientY
      }

      // Show cursor on first mouse move
      if (cursorRef.current && !cursorRef.current.classList.contains('visible')) {
        cursorRef.current.classList.add('visible')
        cursorDotRef.current?.classList.add('visible')
      }
    }

    const handleMouseDown = () => {
      cursorRef.current?.classList.add('cursor-click')
      cursorDotRef.current?.classList.add('cursor-dot-click')
    }

    const handleMouseUp = () => {
      cursorRef.current?.classList.remove('cursor-click')
      cursorDotRef.current?.classList.remove('cursor-dot-click')
    }

    // Smooth cursor animation loop
    const animateCursor = () => {
      // ONLY animate after first mouse move - keeps cursor offscreen until then
      if (!hasMovedMouse.current) {
        requestAnimationFrame(animateCursor)
        return
      }

      // Smooth lerp (linear interpolation)
      const speed = 0.15
      cursorPos.current.x += (cursorTarget.current.x - cursorPos.current.x) * speed
      cursorPos.current.y += (cursorTarget.current.y - cursorPos.current.y) * speed

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x}px, ${cursorPos.current.y}px)`
      }

      if (cursorDotRef.current) {
        // Dot follows instantly for precision
        cursorDotRef.current.style.transform = `translate(${cursorTarget.current.x}px, ${cursorTarget.current.y}px)`
      }

      requestAnimationFrame(animateCursor)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    const animationFrame = requestAnimationFrame(animateCursor)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="glass-cursor"
        style={{ transform: 'translate(-9999px, -9999px)' }}
      />
      <div
        ref={cursorDotRef}
        className="glass-cursor-dot"
        style={{ transform: 'translate(-9999px, -9999px)' }}
      />
    </>
  )
}
