import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer'

// Velocity shader
const velocityShader = `
uniform float uTime;
uniform vec3 uMouse;
uniform float uMouseSpeed;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec3 pos = tmpPos.xyz;
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec3 vel = tmpVel.xyz;
  
  // Mouse repulsion
  vec3 toMouse = pos - uMouse;
  float distToMouse = length(toMouse);
  if (distToMouse < 5.0) {
    vec3 force = normalize(toMouse) * (1.0 - distToMouse / 5.0) * 0.5;
    vel += force;
  }
  
  // Damping
  vel *= 0.98;
  
  // Random movement
  vel.x += sin(uTime + pos.x * 0.1) * 0.001;
  vel.y += cos(uTime + pos.y * 0.1) * 0.001;
  vel.z += sin(uTime + pos.z * 0.1) * 0.001;
  
  gl_FragColor = vec4(vel, 1.0);
}
`

// Position shader
const positionShader = `
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(texturePosition, uv);
  vec3 pos = tmpPos.xyz;
  vec4 tmpVel = texture2D(textureVelocity, uv);
  vec3 vel = tmpVel.xyz;
  
  pos += vel;
  
  // Bounds
  if (pos.x > 25.0 || pos.x < -25.0) vel.x *= -0.9;
  if (pos.y > 25.0 || pos.y < -25.0) vel.y *= -0.9;
  if (pos.z > 25.0 || pos.z < -25.0) vel.z *= -0.9;
  
  gl_FragColor = vec4(pos, 1.0);
}
`

export function GPGPUParticles() {
  const { gl } = useThree()
  const particlesRef = useRef()
  const gpuCompute = useRef()
  const positionVariable = useRef()
  const velocityVariable = useRef()
  
  // Mobile detection
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const SIZE = isMobile ? 128 : 256 // 16k or 65k particles
  const PARTICLE_COUNT = SIZE * SIZE
  
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const references = new Float32Array(PARTICLE_COUNT * 2)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const i2 = i * 2
      
      // Random initial positions
      positions[i3 + 0] = (Math.random() - 0.5) * 50
      positions[i3 + 1] = (Math.random() - 0.5) * 50
      positions[i3 + 2] = (Math.random() - 0.5) * 50
      
      // UV references for GPGPU
      references[i2 + 0] = (i % SIZE) / SIZE
      references[i2 + 1] = Math.floor(i / SIZE) / SIZE
    }
    
    return { positions, references }
  }, [SIZE, PARTICLE_COUNT])
  
  // Initialize GPGPU
  useMemo(() => {
    const gpu = new GPUComputationRenderer(SIZE, SIZE, gl)
    
    // Create textures
    const dtPosition = gpu.createTexture()
    const dtVelocity = gpu.createTexture()
    
    // Fill textures
    const posArray = dtPosition.image.data
    const velArray = dtVelocity.image.data
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i4 = i * 4
      const i3 = i * 3
      
      posArray[i4 + 0] = particlePositions.positions[i3 + 0]
      posArray[i4 + 1] = particlePositions.positions[i3 + 1]
      posArray[i4 + 2] = particlePositions.positions[i3 + 2]
      posArray[i4 + 3] = 1
      
      velArray[i4 + 0] = 0
      velArray[i4 + 1] = 0
      velArray[i4 + 2] = 0
      velArray[i4 + 3] = 1
    }
    
    // Add variables
    velocityVariable.current = gpu.addVariable('textureVelocity', velocityShader, dtVelocity)
    positionVariable.current = gpu.addVariable('texturePosition', positionShader, dtPosition)
    
    // Set dependencies
    gpu.setVariableDependencies(velocityVariable.current, [positionVariable.current, velocityVariable.current])
    gpu.setVariableDependencies(positionVariable.current, [positionVariable.current, velocityVariable.current])
    
    // Set uniforms
    velocityVariable.current.material.uniforms.uTime = { value: 0 }
    velocityVariable.current.material.uniforms.uMouse = { value: new THREE.Vector3() }
    velocityVariable.current.material.uniforms.uMouseSpeed = { value: 0 }
    
    // Initialize
    const error = gpu.init()
    if (error !== null) {
      console.error('GPGPU Error:', error)
    }
    
    gpuCompute.current = gpu
  }, [gl, SIZE, PARTICLE_COUNT, particlePositions])
  
  // Update particles
  useFrame((state) => {
    if (!gpuCompute.current || !particlesRef.current) return
    
    // Update uniforms
    velocityVariable.current.material.uniforms.uTime.value = state.clock.elapsedTime
    velocityVariable.current.material.uniforms.uMouse.value.set(
      state.mouse.x * 20,
      state.mouse.y * 20,
      0
    )
    
    // Compute
    gpuCompute.current.compute()
    
    // Update particle positions from texture
    const texturePosition = gpuCompute.current.getCurrentRenderTarget(positionVariable.current).texture
    particlesRef.current.material.uniforms.uTexturePosition.value = texturePosition
  })
  
  // Particle material
  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexturePosition: { value: null },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0x00ff88) }
      },
      vertexShader: `
        uniform sampler2D uTexturePosition;
        attribute vec2 reference;
        varying vec3 vColor;
        
        void main() {
          vec4 posTemp = texture2D(uTexturePosition, reference);
          vec3 pos = posTemp.xyz;
          
          vColor = vec3(0.0, 1.0, 0.5);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 3.0 * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float distance = length(center);
          if (distance > 0.5) discard;
          
          float strength = 1.0 - (distance * 2.0);
          gl_FragColor = vec4(vColor * strength, strength);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: false
    })
  }, [])
  
  return (
    <points ref={particlesRef} material={particleMaterial}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={particlePositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-reference"
          count={PARTICLE_COUNT}
          array={particlePositions.references}
          itemSize={2}
        />
      </bufferGeometry>
    </points>
  )
}