/**
 * Structured Logger Utility
 *
 * Provides consistent logging with levels (debug, info, warn, error),
 * timestamps, and context metadata for debugging and monitoring.
 *
 * Usage:
 *   import { logger } from './utils/logger'
 *
 *   logger.info('User interaction', { component: 'Button', action: 'click' })
 *   logger.error('Failed to load data', { error: err, context: 'DataFetch' })
 *   logger.debug('Render cycle', { fps: 60, particles: 30000 })
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
}

// Set log level based on environment - only errors in production
const CURRENT_LEVEL = import.meta.env.MODE === 'production'
  ? LOG_LEVELS.ERROR
  : LOG_LEVELS.DEBUG

/**
 * Formats log entry with timestamp and context
 */
function formatLogEntry(level, message, context = {}) {
  const timestamp = new Date().toISOString()
  const logEntry = {
    timestamp,
    level,
    message,
    ...context,
  }

  return logEntry
}

/**
 * Outputs log to console with appropriate styling
 */
function writeLog(level, message, context) {
  const logEntry = formatLogEntry(level, message, context)

  // Choose console method and color based on level
  switch (level) {
    case 'DEBUG':
      if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
        console.debug('%c[DEBUG]', 'color: #888', message, context)
      }
      break

    case 'INFO':
      if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
        console.info('%c[INFO]', 'color: #0088ff', message, context)
      }
      break

    case 'WARN':
      if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
        console.warn('%c[WARN]', 'color: #ffaa00', message, context)
      }
      break

    case 'ERROR':
      if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
        console.error('%c[ERROR]', 'color: #ff006e', message, context)
      }
      break
  }

  return logEntry
}

/**
 * Logger API
 */
export const logger = {
  /**
   * Debug: Detailed diagnostic info (disabled in production)
   * @param {string} message - Log message
   * @param {object} context - Additional context data
   */
  debug(message, context = {}) {
    return writeLog('DEBUG', message, context)
  },

  /**
   * Info: General informational messages (disabled in production)
   * @param {string} message - Log message
   * @param {object} context - Additional context data
   */
  info(message, context = {}) {
    return writeLog('INFO', message, context)
  },

  /**
   * Warn: Warning messages for potential issues
   * @param {string} message - Log message
   * @param {object} context - Additional context data
   */
  warn(message, context = {}) {
    return writeLog('WARN', message, context)
  },

  /**
   * Error: Error messages for failures (always logged)
   * @param {string} message - Log message
   * @param {object} context - Additional context data (should include error)
   */
  error(message, context = {}) {
    return writeLog('ERROR', message, context)
  },

  /**
   * Performance: Log performance metrics (debug level)
   * @param {string} operation - Operation name
   * @param {number} duration - Duration in milliseconds
   * @param {object} metadata - Additional metadata
   */
  performance(operation, duration, metadata = {}) {
    return writeLog('DEBUG', `Performance: ${operation}`, {
      duration: `${duration.toFixed(2)}ms`,
      ...metadata,
    })
  },

  /**
   * Component: Log component lifecycle events (debug level)
   * @param {string} component - Component name
   * @param {string} event - Event type (mount, unmount, update, etc.)
   * @param {object} props - Component props or state
   */
  component(component, event, props = {}) {
    return writeLog('DEBUG', `Component: ${component}`, {
      event,
      ...props,
    })
  },
}

export default logger
