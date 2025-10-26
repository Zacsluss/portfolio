import { useThree } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

export function useCameraDirection() {
  const { camera } = useThree()
  const [direction, setDirection] = useState(new THREE.Vector3(0, 0, -1))

  useEffect(() => {
    const updateDirection = () => {
      const dir = new THREE.Vector3()
      camera.getWorldDirection(dir)
      setDirection(dir.clone())
    }

    // Update on camera changes
    const interval = setInterval(updateDirection, 16) // ~60fps

    return () => clearInterval(interval)
  }, [camera])

  return direction
}
