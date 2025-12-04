import { DEVICE, PARTICLE_CONFIG } from '../config/constants'

/**
 * Detects if the current device is a mobile device based on user agent
 * @returns {boolean} True if mobile device
 */
export function isMobileDevice() {
  return DEVICE.MOBILE_REGEX.test(navigator.userAgent)
}

/**
 * Returns optimal particle count based on device capabilities
 * @returns {number} Particle count - 10K for mobile, 30K for desktop
 */
export function getOptimalParticleCount() {
  return isMobileDevice()
    ? PARTICLE_CONFIG.MOBILE_COUNT
    : PARTICLE_CONFIG.DESKTOP_COUNT
}

/**
 * Returns target FPS based on device capabilities
 * @returns {number} Target FPS - 30 for mobile, 60 for desktop
 */
export function getTargetFPS() {
  return isMobileDevice()
    ? PARTICLE_CONFIG.MOBILE_FPS_TARGET
    : PARTICLE_CONFIG.DESKTOP_FPS_TARGET
}

/**
 * Returns optimal pixel ratio capped at max to prevent excessive GPU load
 * @returns {number} Pixel ratio (max 2 for Retina displays)
 */
export function getOptimalPixelRatio() {
  return Math.min(window.devicePixelRatio, DEVICE.MAX_PIXEL_RATIO)
}
