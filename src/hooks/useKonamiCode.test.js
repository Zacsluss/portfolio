import { vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useKonamiCode } from './useKonamiCode'

describe('useKonamiCode', () => {
  it('should call callback when correct sequence is entered', () => {
    const callback = vi.fn()
    renderHook(() => useKonamiCode(callback))

    const keys = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]

    act(() => {
      keys.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      })
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not call callback for incorrect sequence', () => {
    const callback = vi.fn()
    renderHook(() => useKonamiCode(callback))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'b' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }))
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should reset sequence after successful completion', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKonamiCode(callback))

    const keys = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]

    act(() => {
      keys.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      })
    })

    // Sequence should be reset after success
    expect(result.current).toEqual([])
  })

  it('should handle case-insensitive letter keys', () => {
    const callback = vi.fn()
    renderHook(() => useKonamiCode(callback))

    const keys = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'B', // Capital B should work
      'A', // Capital A should work
    ]

    act(() => {
      keys.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      })
    })

    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should maintain a sliding window of last 10 keys', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKonamiCode(callback))

    // Type 15 random keys
    act(() => {
      for (let i = 0; i < 15; i++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
      }
    })

    // Should only store last 10
    expect(result.current.length).toBe(10)
  })

  it('should track sequence state correctly', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useKonamiCode(callback))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    })

    expect(result.current).toEqual(['ArrowUp'])

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    })

    expect(result.current).toEqual(['ArrowUp', 'ArrowUp'])
  })

  it('should not call callback for partial sequence', () => {
    const callback = vi.fn()
    renderHook(() => useKonamiCode(callback))

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should clean up event listener on unmount', () => {
    const callback = vi.fn()
    const { unmount } = renderHook(() => useKonamiCode(callback))

    unmount()

    // Should not trigger callback after unmount
    act(() => {
      const keys = [
        'ArrowUp',
        'ArrowUp',
        'ArrowDown',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'ArrowLeft',
        'ArrowRight',
        'b',
        'a',
      ]
      keys.forEach((key) => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key }))
      })
    })

    expect(callback).not.toHaveBeenCalled()
  })
})
