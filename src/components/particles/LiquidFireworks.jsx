import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

// Liquid Fireworks Shader Material
const LiquidFireworksMaterial = shaderMaterial(
  {
    time: 0,
    explosionTime: 0,
    explosionCenter: new THREE.Vector3(0, 0, 0),
  },
  // Vertex shader - liquid physics with multiple explosions
  `
    uniform float time;
    uniform float explosionTime;
    uniform vec3 explosionCenter;
    
    attribute vec3 velocity;
    attribute float delay;
    attribute float explosionId;
    attribute vec3 color;
    
    varying vec3 vColor;
    varying float vAlpha;
    varying float vDistance;
    
    void main() {
      vec3 pos = position;
      float t = explosionTime - delay;
      
      if (t > 0.0) {
        // Liquid physics - smooth acceleration with gravity
        float gravity = -9.8;
        float drag = 0.98;
        
        // Initial explosion velocity
        vec3 vel = velocity * 30.0;
        
        // Add liquid turbulence
        vel.x += sin(time * 10.0 + explosionId * 3.14) * 5.0 * t;
        vel.y += cos(time * 8.0 + explosionId * 2.7) * 5.0 * t;
        vel.z += sin(time * 12.0 + explosionId * 1.5) * 3.0 * t;
        
        // Apply physics
        pos = explosionCenter + vel * t;
        pos.y += gravity * t * t * 0.5;
        
        // Liquid dripping effect
        float liquidFactor = sin(t * 20.0 + explosionId * 10.0) * 0.1;
        pos.y += liquidFactor * (1.0 - t);
        
        // Spiral motion for some particles
        if (mod(explosionId, 3.0) == 0.0) {
          float angle = t * 10.0;
          float radius = length(vel.xy) * t * 0.5;
          pos.x += cos(angle) * radius * 0.2;
          pos.z += sin(angle) * radius * 0.2;
        }
        
        // Fountain effect for some particles
        if (mod(explosionId, 5.0) == 0.0) {
          pos.y += sin(t * 15.0) * 10.0 * (1.0 - t);
        }
      }
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic size based on lifetime
      float lifeProgress = clamp(t, 0.0, 1.0);
      float sizeMultiplier = 1.0 - lifeProgress;
      sizeMultiplier = pow(sizeMultiplier, 0.5); // Slower fade
      
      // Sparkle size variation
      float sparkle = sin(time * 50.0 + explosionId * 100.0) * 0.5 + 0.5;
      gl_PointSize = (20.0 + sparkle * 30.0) * sizeMultiplier * (300.0 / -mvPosition.z);
      
      // Color transitions
      vec3 startColor = color;
      vec3 midColor = vec3(1.0, 0.8, 0.3); // Golden
      vec3 endColor = vec3(1.0, 0.3, 0.0); // Red-orange
      
      if (lifeProgress < 0.5) {
        vColor = mix(startColor, midColor, lifeProgress * 2.0);
      } else {
        vColor = mix(midColor, endColor, (lifeProgress - 0.5) * 2.0);
      }
      
      // Add shimmer
      vColor += vec3(sparkle * 0.3);
      
      // Alpha fade with glow boost
      vAlpha = sizeMultiplier * (1.0 + sparkle * 0.5);
      vDistance = length(mvPosition.xyz);
    }
  `,
  // Fragment shader - liquid glow and trails
  `
    varying vec3 vColor;
    varying float vAlpha;
    varying float vDistance;
    
    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      // Create liquid droplet shape
      float droplet = 1.0 - smoothstep(0.0, 0.5, dist);
      
      // Add bright core
      float core = 1.0 - smoothstep(0.0, 0.1, dist);
      
      // Outer glow
      float glow = 1.0 - smoothstep(0.2, 0.5, dist);
      
      // Combine effects
      float alpha = droplet + core * 2.0 + glow * 0.5;
      alpha *= vAlpha;
      
      if (alpha < 0.01) discard;
      
      // Enhance colors
      vec3 finalColor = vColor;
      finalColor = mix(finalColor, vec3(1.0), core * 0.8); // White hot center
      finalColor *= 1.0 + core * 3.0; // Brightness boost
      
      // Distance fog for depth
      float fog = 1.0 - smoothstep(50.0, 200.0, vDistance);
      finalColor *= fog;
      
      gl_FragColor = vec4(finalColor, alpha * 0.8);
    }
  `
)

extend({ LiquidFireworksMaterial })

export function LiquidFireworks({ active = false, count = 500 }) {
  const points = useRef()
  const material = useRef()
  const explosionStartTime = useRef(0)
  
  // Generate multiple firework bursts
  const { positions, velocities, delays, explosionIds, colors } = useMemo(() => {
    const positions = []
    const velocities = []
    const delays = []
    const explosionIds = []
    const colors = []
    
    // Create multiple explosion bursts
    const numBursts = 5
    const particlesPerBurst = Math.floor(count / numBursts)
    
    for (let burst = 0; burst < numBursts; burst++) {
      // Random burst position
      const burstX = (Math.random() - 0.5) * 20
      const burstY = (Math.random() - 0.5) * 10
      const burstZ = (Math.random() - 0.5) * 10
      
      // Random burst color
      const hue = burst / numBursts
      const burstColor = new THREE.Color().setHSL(hue, 1, 0.6)
      
      for (let i = 0; i < particlesPerBurst; i++) {
        // Start position (will be moved to burst center in shader)
        positions.push(burstX, burstY, burstZ)
        
        // Random spherical velocity
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)
        const speed = 0.5 + Math.random() * 1
        
        velocities.push(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        )
        
        // Stagger the explosions
        delays.push(burst * 0.3 + Math.random() * 0.2)
        
        // Explosion ID for variation
        explosionIds.push(i + burst * particlesPerBurst)
        
        // Color with variation
        const colorVariation = 0.2
        colors.push(
          burstColor.r + (Math.random() - 0.5) * colorVariation,
          burstColor.g + (Math.random() - 0.5) * colorVariation,
          burstColor.b + (Math.random() - 0.5) * colorVariation
        )
      }
    }
    
    return {
      positions: new Float32Array(positions),
      velocities: new Float32Array(velocities),
      delays: new Float32Array(delays),
      explosionIds: new Float32Array(explosionIds),
      colors: new Float32Array(colors)
    }
  }, [count])
  
  // Trigger explosion when activated
  useEffect(() => {
    if (active) {
      explosionStartTime.current = Date.now()
    }
  }, [active])
  
  // Animation loop
  useFrame((state) => {
    if (material.current) {
      material.current.time = state.clock.elapsedTime
      
      if (explosionStartTime.current > 0) {
        const elapsed = (Date.now() - explosionStartTime.current) / 1000
        material.current.explosionTime = elapsed
        
        // Reset after animation completes
        if (elapsed > 5) {
          explosionStartTime.current = 0
          material.current.explosionTime = 0
        }
      }
    }
    
    // Rotate the whole system slowly
    if (points.current && explosionStartTime.current > 0) {
      points.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })
  
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-velocity"
          count={count}
          array={velocities}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-delay"
          count={count}
          array={delays}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-explosionId"
          count={count}
          array={explosionIds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <liquidFireworksMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}