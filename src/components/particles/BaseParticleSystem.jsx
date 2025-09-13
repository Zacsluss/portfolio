import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BaseParticleSystem({ count = 5000 }) {
  const mesh = useRef()
  const light = useRef()

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = Math.random() * 100 - 50
      const y = Math.random() * 100 - 50
      const z = Math.random() * 100 - 50
      temp.push({ time, factor, speed, x, y, z })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    if (!mesh.current) return
    
    particles.forEach((particle, i) => {
      let { factor, speed, x, y, z } = particle
      const t = (particle.time += speed)
      
      dummy.position.set(
        x + Math.cos(t) * factor,
        y + Math.sin(t) * factor,
        z + Math.cos(t) * factor
      )
      dummy.scale.setScalar(Math.sin(t * 0.5) * 0.5 + 1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <pointLight ref={light} position={[0, 0, 0]} intensity={0.5} color="#00ff88" />
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <sphereGeometry args={[0.05]} />
        <meshPhongMaterial color="#ffffff" emissive="#00ff88" emissiveIntensity={0.1} />
      </instancedMesh>
    </>
  )
}