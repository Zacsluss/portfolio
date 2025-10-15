import { useState, useEffect, useRef } from 'react'

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a'
]

/**
 * Custom hook to detect Konami Code input sequence
 *
 * Listens for the classic Konami Code (↑↑↓↓←→←→BA) and triggers a callback
 * when the full sequence is entered. Uses useRef to maintain a stable event
 * listener without causing memory leaks from re-binding on state changes.
 *
 * @param {Function} callback - Function to call when code is entered
 * @returns {Array} Current key sequence (for debugging)
 */
export function useKonamiCode(callback) {
  const [sequence, setSequence] = useState([])
  const callbackRef = useRef(callback)

  // Keep callback ref fresh without triggering effect re-run
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Convert to lowercase for letters, keep arrows as-is
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key

      setSequence(prevSequence => {
        const newSequence = [...prevSequence, key].slice(-10)

        // Check if completed
        if (JSON.stringify(newSequence) === JSON.stringify(KONAMI_CODE)) {
          callbackRef.current()
          return [] // Reset after success
        }

        return newSequence
      })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, []) // Empty deps - stable listener, no memory leak

  return sequence
}
