import { useEffect, useRef } from 'react'
import './SimpleCursor.css'

export function SimpleCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    let mouseX = -9999
    let mouseY = -9999
    let cursorX = -9999
    let cursorY = -9999

    const handleMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Smooth follow with lerp
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.left = `${cursorX}px`
        cursorRef.current.style.top = `${cursorY}px`
      }

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return <div ref={cursorRef} className="simple-cursor" />
}
