import { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

export function SimpleTextParticles({ text = "HELLO", size = 50 }) {
  const pointsRef = useRef()
  const canvasRef = useRef()
  
  // Create particles from text using canvas
  const { positions, originalPositions, randomPositions, colors } = useMemo(() => {
    // Create canvas to draw text
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 512
    canvas.height = 256
    
    // Clear canvas
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Draw text
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${size}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    // Find white pixels (text)
    const particles = []
    const gap = 3 // Sample every 3rd pixel for performance
    
    for (let y = 0; y < canvas.height; y += gap) {
      for (let x = 0; x < canvas.width; x += gap) {
        const index = (y * canvas.width + x) * 4
        const brightness = data[index] // Red channel (all are same for white)
        
        if (brightness > 128) { // If pixel is bright (part of text)
          particles.push({
            x: (x - canvas.width / 2) * 0.1,
            y: -(y - canvas.height / 2) * 0.1,
            z: 0
          })
        }
      }
    }
    
    // Create arrays
    const count = particles.length
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    const randomPositions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Original position (text shape)
      originalPositions[i3] = particles[i].x
      originalPositions[i3 + 1] = particles[i].y
      originalPositions[i3 + 2] = particles[i].z
      
      // Random starting position
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 50
      randomPositions[i3] = Math.cos(angle) * radius
      randomPositions[i3 + 1] = Math.sin(angle) * radius
      randomPositions[i3 + 2] = (Math.random() - 0.5) * 10
      
      // Start at random position
      positions[i3] = randomPositions[i3]
      positions[i3 + 1] = randomPositions[i3 + 1]
      positions[i3 + 2] = randomPositions[i3 + 2]
      
      // Colors
      colors[i3] = 0 // R
      colors[i3 + 1] = 1 // G
      colors[i3 + 2] = 0.5 // B
    }
    
    canvasRef.current = canvas
    console.log(`Created ${count} particles for text: "${text}"`)
    
    return { positions, originalPositions, randomPositions, colors }
  }, [text, size])
  
  // Animate particles forming text
  useEffect(() => {
    if (!pointsRef.current || positions.length === 0) return
    
    const geometry = pointsRef.current.geometry
    const positionAttribute = geometry.attributes.position
    
    // Animate from random to text positions
    const animationProps = { progress: 0 }
    
    gsap.to(animationProps, {
      progress: 1,
      duration: 3,
      ease: "power3.inOut",
      delay: 0.5,
      onUpdate: () => {
        const progress = animationProps.progress
        const array = positionAttribute.array
        
        for (let i = 0; i < array.length; i += 3) {
          // Interpolate between random and original positions
          array[i] = randomPositions[i] + (originalPositions[i] - randomPositions[i]) * progress
          array[i + 1] = randomPositions[i + 1] + (originalPositions[i + 1] - randomPositions[i + 1]) * progress
          array[i + 2] = randomPositions[i + 2] + (originalPositions[i + 2] - randomPositions[i + 2]) * progress
        }
        
        positionAttribute.needsUpdate = true
      }
    })
  }, [positions, originalPositions, randomPositions])
  
  // Floating animation
  useFrame((state) => {
    if (!pointsRef.current) return
    
    const time = state.clock.elapsedTime
    pointsRef.current.rotation.y = Math.sin(time * 0.1) * 0.1
    
    // Gentle floating
    const positionAttribute = pointsRef.current.geometry.attributes.position
    const array = positionAttribute.array
    
    for (let i = 0; i < array.length; i += 3) {
      const originalY = originalPositions[i + 1]
      array[i + 1] = originalY + Math.sin(time * 2 + i * 0.01) * 0.05
    }
    
    positionAttribute.needsUpdate = true
  })
  
  if (positions.length === 0) return null
  
  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}