import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function GalaxyBackground({ count = 100000 }) {
  const points = useRef()
  
  const parameters = {
    count: count,
    size: 0.01,
    radius: 50,
    branches: 3,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984'
  }
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    
    const colorInside = new THREE.Color(parameters.insideColor)
    const colorOutside = new THREE.Color(parameters.outsideColor)
    
    for(let i = 0; i < parameters.count; i++) {
      const i3 = i * 3
      
      // Position
      const radius = Math.random() * parameters.radius
      const spinAngle = radius * parameters.spin
      const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
      
      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
      
      // Color
      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / parameters.radius)
      
      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }
    
    return [positions, colors]
  }, [])
  
  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.02
    }
  })
  
  return (
    <points ref={points}>
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
        size={0.01} 
        sizeAttenuation={true}
        depthWrite={false}
        vertexColors 
        blending={THREE.AdditiveBlending}
        transparent={true}
        opacity={0.8}
      />
    </points>
  )
}