/**
 * Application configuration constants
 * Centralized to avoid magic numbers scattered throughout codebase
 */

// ===== PARTICLE SYSTEM =====
export const PARTICLE_CONFIG = {
  // Particle counts per device type
  DESKTOP_COUNT: 30000,
  MOBILE_COUNT: 10000,

  // Performance targets
  DESKTOP_FPS_TARGET: 60,
  MOBILE_FPS_TARGET: 30,

  // Default text
  DEFAULT_TEXT: 'Zachary Sluss',
  MAX_TEXT_LENGTH: 20,
}

// ===== DEVICE DETECTION =====
export const DEVICE = {
  MOBILE_REGEX: /iPhone|iPad|iPod|Android/i,
  MAX_PIXEL_RATIO: 2, // Prevent excessive GPU load on Retina displays
}

// ===== ANIMATION TIMING =====
export const ANIMATION = {
  // Konami code easter egg duration
  KONAMI_DURATION_MS: 5000,

  // Scroll behavior
  SCROLL_HIDE_THRESHOLD_PX: 100,

  // Fade-in delays (ms)
  FADE_DELAY_INCREMENT: 200,

  // Morph completion
  MORPH_COMPLETE_DELAY_MS: 1000,
}

// ===== CAMERA SETTINGS =====
export const CAMERA = {
  POSITION: [0, 0, 28],
  FOV: 85, // Field of view in degrees
  NEAR_CLIP: 0.1,
  FAR_CLIP: 1000,
}

// ===== LIGHTING =====
export const LIGHTING = {
  AMBIENT_INTENSITY: 0.02,
  AMBIENT_COLOR: '#1a1a2e',

  POINT_LIGHT_1: {
    position: [50, 50, 50],
    intensity: 0.1,
    color: '#4a5f8f',
  },

  POINT_LIGHT_2: {
    position: [-50, -50, -50],
    intensity: 0.08,
    color: '#2d3561',
  },
}

// ===== ORBIT CONTROLS =====
export const CONTROLS = {
  ENABLE_ZOOM: false,
  ENABLE_PAN: false,
  ENABLE_ROTATE: true,
  AUTO_ROTATE: false,
  ENABLE_DAMPING: true,
  DAMPING_FACTOR: 0.05,
  ROTATE_SPEED: 0.5,
  TARGET: [0, 5, 0],
}

// ===== BUILD CONFIGURATION =====
export const BUILD = {
  CHUNK_SIZE_WARNING_KB: 1000,
  ASSET_INLINE_LIMIT_BYTES: 4096,
}
