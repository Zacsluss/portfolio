import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import * as THREE from 'three'
import gsap from 'gsap'

export function TextParticles({ text = "HELLO", size = 2, particleSize = 0.03 }) {
  const mesh = useRef()
  const [isAnimating, setIsAnimating] = useState(true)
  
  // Load font
  const font = useLoader(FontLoader, '/fonts/helvetiker_bold.typeface.json')
  
  // Generate particles from text
  const { positions, originalPositions, randomPositions } = useMemo(() => {
    if (!font) return { positions: [], originalPositions: [], randomPositions: [] }
    
    // Create text geometry with more segments for better letter definition
    const geometry = new TextGeometry(text, {
      font: font,
      size: size,
      height: 0.5,  // Increased depth
      curveSegments: 20,  // More segments for better curves
      bevelEnabled: true,  // Enable bevel for more vertices
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 5
    })
    
    // Center the geometry
    geometry.computeBoundingBox()
    const boundingBox = geometry.boundingBox
    const center = new THREE.Vector3()
    boundingBox.getCenter(center)
    geometry.translate(-center.x, -center.y, -center.z)
    
    // Sample points from geometry - use ALL vertices for better letter formation
    const vertices = []
    const positionAttribute = geometry.getAttribute('position')
    
    // Sample every vertex for complete letter formation
    for (let i = 0; i < positionAttribute.count; i++) {
      vertices.push({
        x: positionAttribute.getX(i),
        y: positionAttribute.getY(i),
        z: positionAttribute.getZ(i)
      })
    }
    
    // Create arrays for current, original, and random positions
    const count = vertices.length
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    const randomPositions = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      
      // Original position (text shape)
      originalPositions[i3] = vertices[i].x
      originalPositions[i3 + 1] = vertices[i].y
      originalPositions[i3 + 2] = vertices[i].z
      
      // Random starting position
      randomPositions[i3] = (Math.random() - 0.5) * 30
      randomPositions[i3 + 1] = (Math.random() - 0.5) * 30
      randomPositions[i3 + 2] = (Math.random() - 0.5) * 10
      
      // Start at random position
      positions[i3] = randomPositions[i3]
      positions[i3 + 1] = randomPositions[i3 + 1]
      positions[i3 + 2] = randomPositions[i3 + 2]
    }
    
    geometry.dispose()
    
    return { positions, originalPositions, randomPositions }
  }, [font, text, size])
  
  // Animate particles forming text
  useEffect(() => {
    if (!mesh.current || positions.length === 0) return
    
    const geometry = mesh.current.geometry
    const positionAttribute = geometry.attributes.position
    
    // Animate from random to text positions
    const animationProps = { progress: 0 }
    
    gsap.to(animationProps, {
      progress: 1,
      duration: 2,
      ease: "elastic.out(1, 0.3)",
      delay: 0.5,
      onUpdate: () => {
        const progress = animationProps.progress
        const array = positionAttribute.array
        
        for (let i = 0; i < array.length; i += 3) {
          array[i] = randomPositions[i] + (originalPositions[i] - randomPositions[i]) * progress
          array[i + 1] = randomPositions[i + 1] + (originalPositions[i + 1] - randomPositions[i + 1]) * progress
          array[i + 2] = randomPositions[i + 2] + (originalPositions[i + 2] - randomPositions[i + 2]) * progress
        }
        
        positionAttribute.needsUpdate = true
      },
      onComplete: () => {
        setIsAnimating(false)
      }
    })
  }, [positions, originalPositions, randomPositions])
  
  // Float animation after formation
  useFrame((state) => {
    if (!mesh.current || isAnimating) return
    
    const time = state.clock.elapsedTime
    const positionAttribute = mesh.current.geometry.attributes.position
    const array = positionAttribute.array
    
    for (let i = 0; i < array.length; i += 3) {
      const originalY = originalPositions[i + 1]
      array[i + 1] = originalY + Math.sin(time + i * 0.01) * 0.1
    }
    
    positionAttribute.needsUpdate = true
    
    // Rotate slowly
    mesh.current.rotation.y = Math.sin(time * 0.2) * 0.1
  })
  
  if (positions.length === 0) return null
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        color="#00ff88"
        transparent
        opacity={0.9}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}