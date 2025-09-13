import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'

// Custom shader material for fluid-like particles
const FluidParticleMaterial = shaderMaterial(
  {
    time: 0,
    morphProgress: 0,
    mousePosition: new THREE.Vector2(0, 0),
    blackHoleEffect: 0,
    explosionEffect: 0,
    colorA: new THREE.Color('#00ff88'),
    colorB: new THREE.Color('#0088ff'),
    colorC: new THREE.Color('#ff006e'),
    colorD: new THREE.Color('#ffaa00'),
    colorE: new THREE.Color('#aa00ff'),
  },
  // Vertex shader
  `
    uniform float time;
    uniform float morphProgress;
    uniform vec2 mousePosition;
    uniform float blackHoleEffect;
    uniform float explosionEffect;
    
    attribute vec3 targetPosition;
    attribute float randomness;
    attribute float speed;
    attribute float offset;
    attribute float colorSeed;
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      // Fluid physics simulation
      float t = morphProgress;
      vec3 pos = position;
      
      // Add turbulence and flow
      float turbulence = sin(time * speed + offset * 6.28) * (1.0 - t) * randomness * 5.0;
      pos.x += sin(time * 0.5 + offset * 3.14) * turbulence;
      pos.y += cos(time * 0.3 + offset * 2.0) * turbulence;
      pos.z += sin(time * 0.7 + offset * 4.0) * turbulence * 0.5;
      
      // Morph to target position with elastic easing
      float elasticT = t < 0.5 
        ? 4.0 * t * t * t 
        : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
      
      vec3 morphedPos = mix(pos, targetPosition, elasticT);
      
      // Black hole effect
      if (blackHoleEffect > 0.0) {
        vec3 blackHoleCenter = vec3(0.0, 0.0, 0.0);
        vec3 toCenter = blackHoleCenter - morphedPos;
        float distance = length(toCenter);
        
        // Spiral into black hole
        float pullStrength = blackHoleEffect * (1.0 - smoothstep(0.0, 30.0, distance));
        morphedPos += toCenter * pullStrength;
        
        // Add rotation for spiral effect
        float angle = blackHoleEffect * 10.0 + distance * 0.5;
        float cosAngle = cos(angle);
        float sinAngle = sin(angle);
        float x = morphedPos.x;
        float z = morphedPos.z;
        morphedPos.x = x * cosAngle - z * sinAngle;
        morphedPos.z = x * sinAngle + z * cosAngle;
      }
      
      // Supernova explosion effect with smooth transition
      if (explosionEffect > 0.0) {
        vec3 explosionCenter = vec3(0.0, 0.0, 0.0);
        vec3 fromCenter = morphedPos - explosionCenter;
        
        // Smoother explosion curve
        float smoothExplosion = smoothstep(0.0, 1.0, explosionEffect);
        float explosionForce = smoothExplosion * 30.0 * (1.0 - smoothExplosion * 0.5);
        morphedPos += normalize(fromCenter) * explosionForce;
        
        // Reduced randomness for smoother motion
        morphedPos.x += sin(offset * 10.0) * smoothExplosion * 2.0;
        morphedPos.y += cos(offset * 7.0) * smoothExplosion * 2.0;
        morphedPos.z += sin(offset * 13.0) * smoothExplosion * 1.0;
      }
      
      // Add mouse influence
      vec2 mouseOffset = (mousePosition - vec2(morphedPos.x, morphedPos.y)) * 0.1;
      float mouseDistance = length(mouseOffset);
      if (mouseDistance < 5.0) {
        morphedPos.xy -= mouseOffset * (1.0 - mouseDistance / 5.0) * 2.0;
      }
      
      // Subtle pulsing effect when in position
      float pulse = sin(time * 3.0 + offset * 10.0) * 0.02 * t;
      morphedPos *= 1.0 + pulse;
      
      // Set final position
      vec4 mvPosition = modelViewMatrix * vec4(morphedPos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      // Dynamic point size based on depth and morph state
      float sizeBase = 3.0;
      float depthSize = sizeBase * (300.0 / -mvPosition.z);
      float morphSize = mix(2.0, depthSize, t);
      
      // Slightly increase size during effects (was 3.0, now 0.5)
      float effectSize = 1.0 + max(blackHoleEffect, explosionEffect) * 0.5;
      gl_PointSize = morphSize * (1.0 + pulse * 0.2) * effectSize;
      
      // Enhanced colors during effects
      float effectBoost = max(blackHoleEffect, explosionEffect);
      
      // Gradient sweep across the text horizontally
      float normalizedX = (targetPosition.x + 15.0) / 30.0;
      float gradientPosition = normalizedX + time * 0.2 + effectBoost * 5.0; // Speed up during effects
      
      // Create smooth rainbow gradient across letters
      vec3 color1 = vec3(0.0, 1.0, 0.53); // cyan
      vec3 color2 = vec3(0.0, 0.53, 1.0); // blue
      vec3 color3 = vec3(1.0, 0.0, 0.43); // magenta
      vec3 color4 = vec3(1.0, 0.67, 0.0); // orange
      vec3 color5 = vec3(0.67, 0.0, 1.0); // purple
      
      // Smooth gradient based on X position
      float colorPhase = mod(gradientPosition * 2.0, 5.0);
      
      if (colorPhase < 1.0) {
        vColor = mix(color1, color2, colorPhase);
      } else if (colorPhase < 2.0) {
        vColor = mix(color2, color3, colorPhase - 1.0);
      } else if (colorPhase < 3.0) {
        vColor = mix(color3, color4, colorPhase - 2.0);
      } else if (colorPhase < 4.0) {
        vColor = mix(color4, color5, colorPhase - 3.0);
      } else {
        vColor = mix(color5, color1, colorPhase - 4.0);
      }
      
      // Subtle shimmer effect, enhanced during effects
      vColor += vec3(0.1) * sin(time * 8.0 + normalizedX * 10.0) * t;
      
      // Make colors slightly more vibrant during effects
      if (effectBoost > 0.0) {
        vColor = mix(vColor, vec3(1.0, 0.5, 0.0), effectBoost * 0.2); // Subtle golden tint
        vColor *= 1.0 + effectBoost * 0.3; // Much less brightness boost
      }
      
      // Alpha based on morph progress - slightly enhanced during effects
      vAlpha = mix(0.1, 0.3, t) * (0.8 + pulse * 0.1);
      vAlpha = mix(vAlpha, 0.4, effectBoost * 0.5); // Much less brightness during effects
    }
  `,
  // Fragment shader
  `
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      // Simple circular particle shape (no rays)
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      // No sparkle rays for cleaner look
      float rays = 1.0;
      
      // Much sharper, smaller particles
      float core = 1.0 - smoothstep(0.0, 0.2, dist);
      float innerGlow = 1.0 - smoothstep(0.2, 0.4, dist);
      
      float alpha = core * 0.6 + innerGlow * 0.2;
      alpha *= vAlpha;
      
      if (alpha < 0.01) discard;
      
      // Much less brightness and glow
      vec3 finalColor = vColor;
      finalColor = mix(finalColor, vec3(1.0), core * 0.1); // Minimal white
      finalColor *= 1.0 + core * 0.2; // Very reduced brightness
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ FluidParticleMaterial })

export function FluidTextParticles({ text = 'HELLO', size = 100, konamiActivated = false }) {
  const points = useRef()
  const material = useRef()
  const { viewport, mouse } = useThree()
  const morphStartTime = useRef(Date.now())
  const isForming = useRef(false)
  const previousText = useRef(text)
  const blackHoleStartTime = useRef(0)
  const explosionStartTime = useRef(0)
  
  // Generate text particles with physics attributes
  const { positions, targetPositions, randomness, speeds, offsets, colorSeeds, particleCount } = useMemo(() => {
    // Create canvas for text sampling
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = 1024
    canvas.height = 256
    
    // Draw text
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${size}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)
    
    // Get actual bounds of the rendered text
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    
    // Find actual text bounds
    let minX = canvas.width
    let maxX = 0
    let minY = canvas.height
    let maxY = 0
    
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        const index = (y * canvas.width + x) * 4
        if (pixels[index] > 128) {
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
          minY = Math.min(minY, y)
          maxY = Math.max(maxY, y)
        }
      }
    }
    
    const textCenterX = (minX + maxX) / 2
    const textCenterY = (minY + maxY) / 2
    const textWidth = maxX - minX
    const textHeight = maxY - minY
    
    // Pixels already loaded above
    
    const positions = []
    const targetPositions = []
    const randomness = []
    const speeds = []
    const offsets = []
    const colorSeeds = []
    
    // Sample more densely for fluid effect
    const step = 1
    for (let x = 0; x < canvas.width; x += step) {
      for (let y = 0; y < canvas.height; y += step) {
        const index = (y * canvas.width + x) * 4
        const brightness = pixels[index]
        
        if (brightness > 128) {
          // Target position centered at origin
          const scale = 0.12 // 2x bigger for better visibility
          const px = (x - textCenterX) * scale
          const py = -(y - textCenterY) * scale
          const pz = (Math.random() - 0.5) * 2
          
          targetPositions.push(px, py, pz)
          
          // Starting position (scattered in space)
          const angle = Math.random() * Math.PI * 2
          const radius = 20 + Math.random() * 30
          const startX = Math.cos(angle) * radius
          const startY = Math.sin(angle) * radius
          const startZ = (Math.random() - 0.5) * 20
          
          positions.push(startX, startY, startZ)
          
          // Physics attributes
          randomness.push(Math.random())
          speeds.push(0.5 + Math.random() * 2)
          offsets.push(Math.random() * Math.PI * 2)
          colorSeeds.push(Math.random())
        }
      }
    }
    
    return {
      positions: new Float32Array(positions),
      targetPositions: new Float32Array(targetPositions),
      randomness: new Float32Array(randomness),
      speeds: new Float32Array(speeds),
      offsets: new Float32Array(offsets),
      colorSeeds: new Float32Array(colorSeeds),
      particleCount: positions.length / 3
    }
  }, [text, size, viewport])
  
  // Start morph animation and handle text changes
  useEffect(() => {
    // Reset morph when text changes
    if (previousText.current !== text) {
      isForming.current = false
      morphStartTime.current = Date.now() + 500
      previousText.current = text
      
      // Start morphing to new text
      const timer = setTimeout(() => {
        isForming.current = true
        morphStartTime.current = Date.now()
      }, 500)
      return () => clearTimeout(timer)
    } else {
      // Initial morph
      const timer = setTimeout(() => {
        isForming.current = true
        morphStartTime.current = Date.now()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [text])
  
  // Handle Konami code activation
  useEffect(() => {
    if (konamiActivated) {
      blackHoleStartTime.current = Date.now()
      // Start explosion after black hole
      setTimeout(() => {
        explosionStartTime.current = Date.now()
      }, 2000)
    }
  }, [konamiActivated])
  
  // Animation loop
  useFrame((state) => {
    if (material.current) {
      material.current.time = state.clock.elapsedTime
      
      // Update morph progress with smooth easing
      if (isForming.current) {
        const elapsed = (Date.now() - morphStartTime.current) / 3000 // 3 second morph
        material.current.morphProgress = Math.min(elapsed, 1)
      } else {
        material.current.morphProgress = 0
      }
      
      // Black hole effect (0-2 seconds)
      if (blackHoleStartTime.current > 0) {
        const blackHoleElapsed = (Date.now() - blackHoleStartTime.current) / 2000
        if (blackHoleElapsed < 1) {
          material.current.blackHoleEffect = blackHoleElapsed
        } else if (blackHoleElapsed < 2) {
          material.current.blackHoleEffect = 2 - blackHoleElapsed
        } else {
          material.current.blackHoleEffect = 0
        }
      } else {
        material.current.blackHoleEffect = 0
      }
      
      // Explosion effect (starts at 2 seconds, lasts 3 seconds with smooth fade)
      if (explosionStartTime.current > 0) {
        const explosionElapsed = (Date.now() - explosionStartTime.current) / 3000
        if (explosionElapsed < 0.5) {
          // Ramp up explosion
          material.current.explosionEffect = explosionElapsed * 2
        } else if (explosionElapsed < 1) {
          // Fade out explosion smoothly
          material.current.explosionEffect = 2 - (explosionElapsed * 2)
        } else {
          material.current.explosionEffect = 0
          // Clean reset after animation completes
          if (explosionElapsed > 1.2) {
            blackHoleStartTime.current = 0
            explosionStartTime.current = 0
          }
        }
      } else {
        material.current.explosionEffect = 0
      }
      
      // Update mouse position for interactivity
      material.current.mousePosition.x = mouse.x * viewport.width / 2
      material.current.mousePosition.y = mouse.y * viewport.height / 2
    }
    
    // Keep text centered at origin
    if (points.current) {
      points.current.position.set(0, 0, 0)
      // Subtle rotation for depth
      if (material.current && material.current.morphProgress > 0.5) {
        points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05
        points.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.3) * 0.02
      }
    }
  })
  
  return (
    <points ref={points} key={text}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-targetPosition"
          count={particleCount}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-randomness"
          count={particleCount}
          array={randomness}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-speed"
          count={particleCount}
          array={speeds}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-offset"
          count={particleCount}
          array={offsets}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-colorSeed"
          count={particleCount}
          array={colorSeeds}
          itemSize={1}
        />
      </bufferGeometry>
      <fluidParticleMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}