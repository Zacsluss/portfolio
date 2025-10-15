import { isMobileDevice, getOptimalParticleCount, getTargetFPS, getOptimalPixelRatio } from './device'

describe('device utilities', () => {
  describe('isMobileDevice', () => {
    beforeEach(() => {
      // Reset navigator.userAgent mock before each test
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        configurable: true,
      })
    })

    it('should detect iPhone as mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      })
      expect(isMobileDevice()).toBe(true)
    })

    it('should detect iPad as mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        writable: true,
      })
      expect(isMobileDevice()).toBe(true)
    })

    it('should detect Android as mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Linux; Android 10)',
        writable: true,
      })
      expect(isMobileDevice()).toBe(true)
    })

    it('should detect desktop as non-mobile', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
      })
      expect(isMobileDevice()).toBe(false)
    })

    it('should be case-insensitive', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iphone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      })
      expect(isMobileDevice()).toBe(true)
    })
  })

  describe('getOptimalParticleCount', () => {
    it('should return 10000 for mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        writable: true,
      })
      expect(getOptimalParticleCount()).toBe(10000)
    })

    it('should return 30000 for desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        writable: true,
      })
      expect(getOptimalParticleCount()).toBe(30000)
    })
  })

  describe('getTargetFPS', () => {
    it('should return 30 for mobile devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Android; Mobile)',
        writable: true,
      })
      expect(getTargetFPS()).toBe(30)
    })

    it('should return 60 for desktop devices', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        writable: true,
      })
      expect(getTargetFPS()).toBe(60)
    })
  })

  describe('getOptimalPixelRatio', () => {
    it('should return actual pixel ratio if below 2', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 1,
        writable: true,
      })
      expect(getOptimalPixelRatio()).toBe(1)
    })

    it('should cap pixel ratio at 2 for high DPI displays', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 3,
        writable: true,
      })
      expect(getOptimalPixelRatio()).toBe(2)
    })

    it('should return 2 for Retina displays (2x)', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 2,
        writable: true,
      })
      expect(getOptimalPixelRatio()).toBe(2)
    })

    it('should handle fractional pixel ratios', () => {
      Object.defineProperty(window, 'devicePixelRatio', {
        value: 1.5,
        writable: true,
      })
      expect(getOptimalPixelRatio()).toBe(1.5)
    })
  })
})
