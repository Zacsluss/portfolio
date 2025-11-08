import { useEffect, useRef, useState } from 'react'
import { logger } from '../utils/logger'

/**
 * Performance Monitor Hook
 *
 * Tracks real-time performance metrics for React Three Fiber applications:
 * - FPS (frames per second)
 * - Memory usage (heap size)
 * - Frame time (ms per frame)
 * - Long tasks (frames > 16.67ms threshold)
 *
 * Usage:
 *   const { fps, memory, frameTime } = usePerformanceMonitor({
 *     enabled: true,
 *     logInterval: 5000, // Log every 5 seconds
 *     warnThreshold: 30, // Warn if FPS drops below 30
 *   })
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Enable monitoring (default: true in dev, false in prod)
 * @param {number} options.logInterval - How often to log metrics in ms (default: 10000)
 * @param {number} options.warnThreshold - FPS threshold for warnings (default: 30)
 * @returns {Object} Current performance metrics
 */
export function usePerformanceMonitor(options = {}) {
  const {
    enabled = import.meta.env.DEV, // Only enable in development by default
    logInterval = 10000, // Log every 10 seconds
    warnThreshold = 30, // Warn if FPS < 30
  } = options

  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    frameTime: 0,
    longTasks: 0,
  })

  const frameCount = useRef(0)
  const lastTime = useRef(performance.now())
  const lastLogTime = useRef(performance.now())
  const longTaskCount = useRef(0)
  const rafId = useRef(null)

  useEffect(() => {
    if (!enabled) return

    logger.info('Performance monitoring started', {
      logInterval: `${logInterval}ms`,
      warnThreshold: `${warnThreshold} FPS`,
    })

    const measureFrame = () => {
      const now = performance.now()
      const delta = now - lastTime.current
      frameCount.current++

      // Track long tasks (frames taking > 16.67ms = 60 FPS target)
      if (delta > 16.67) {
        longTaskCount.current++
      }

      // Calculate and log metrics every logInterval
      if (now - lastLogTime.current >= logInterval) {
        const elapsed = now - lastLogTime.current
        const fps = Math.round((frameCount.current / elapsed) * 1000)
        const avgFrameTime = elapsed / frameCount.current

        // Get memory usage (if available)
        let memoryUsage = 0
        if (performance.memory) {
          memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576) // MB
        }

        // Update metrics state
        const newMetrics = {
          fps,
          memory: memoryUsage,
          frameTime: avgFrameTime,
          longTasks: longTaskCount.current,
        }

        setMetrics(newMetrics)

        // Log metrics
        if (fps < warnThreshold) {
          logger.warn('Performance degradation detected', {
            fps,
            frameTime: `${avgFrameTime.toFixed(2)}ms`,
            longTasks: longTaskCount.current,
            memory: memoryUsage ? `${memoryUsage}MB` : 'N/A',
          })
        } else {
          logger.debug('Performance metrics', {
            fps,
            frameTime: `${avgFrameTime.toFixed(2)}ms`,
            longTasks: longTaskCount.current,
            memory: memoryUsage ? `${memoryUsage}MB` : 'N/A',
          })
        }

        // Reset counters
        frameCount.current = 0
        lastLogTime.current = now
        longTaskCount.current = 0
      }

      lastTime.current = now
      rafId.current = requestAnimationFrame(measureFrame)
    }

    rafId.current = requestAnimationFrame(measureFrame)

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
      logger.info('Performance monitoring stopped')
    }
  }, [enabled, logInterval, warnThreshold])

  return metrics
}

/**
 * Measure and log the execution time of a function
 *
 * Usage:
 *   measurePerformance('dataFetch', async () => {
 *     const data = await fetchData()
 *     return data
 *   })
 *
 * @param {string} label - Operation name for logging
 * @param {Function} fn - Function to measure
 * @returns {Promise<any>} Result of the function
 */
export async function measurePerformance(label, fn) {
  const start = performance.now()

  try {
    const result = await fn()
    const duration = performance.now() - start

    logger.performance(label, duration, { status: 'success' })

    return result
  } catch (error) {
    const duration = performance.now() - start

    logger.performance(label, duration, {
      status: 'error',
      error: error.message,
    })

    throw error
  }
}

/**
 * Mark a component lifecycle event for performance tracking
 *
 * Usage:
 *   useEffect(() => {
 *     markComponent('FluidTextParticles', 'mount', { particleCount: 30000 })
 *     return () => markComponent('FluidTextParticles', 'unmount')
 *   }, [])
 *
 * @param {string} component - Component name
 * @param {string} event - Event type (mount, unmount, update, etc.)
 * @param {object} metadata - Additional metadata
 */
export function markComponent(component, event, metadata = {}) {
  logger.component(component, event, metadata)

  // Also create a Performance Mark for browser DevTools
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(`${component}:${event}`)
  }
}
