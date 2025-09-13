import { useState, useEffect } from 'react'

export function useKonamiCode(callback) {
  const [sequence, setSequence] = useState([])
  const konamiCode = [
    'ArrowUp', 'ArrowUp', 
    'ArrowDown', 'ArrowDown', 
    'ArrowLeft', 'ArrowRight', 
    'ArrowLeft', 'ArrowRight', 
    'b', 'a'
  ]
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Convert to lowercase for letters, keep arrows as-is
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const newSequence = [...sequence, key].slice(-10)
      setSequence(newSequence)
      
      if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
        callback()
        setSequence([]) // Reset after success
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [sequence, callback])
  
  return sequence
}