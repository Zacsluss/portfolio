import { PARTICLE_CONFIG } from '../config/constants'

/**
 * Sanitizes user input for the name field
 * Removes special characters, emojis, and control characters
 *
 * @param {string} input - Raw user input
 * @returns {string} Sanitized string (alphanumeric, spaces, hyphens only)
 */
export function sanitizeName(input) {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/[^\w\s-]/g, '') // Only alphanumeric, spaces, hyphens
    .slice(0, PARTICLE_CONFIG.MAX_TEXT_LENGTH) // Enforce max length
    .trim()
}
