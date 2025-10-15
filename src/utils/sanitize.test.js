import { sanitizeName } from './sanitize'

describe('sanitizeName', () => {
  it('should allow alphanumeric characters', () => {
    expect(sanitizeName('John123')).toBe('John123')
  })

  it('should allow spaces', () => {
    expect(sanitizeName('John Doe')).toBe('John Doe')
  })

  it('should allow hyphens', () => {
    expect(sanitizeName('Mary-Jane')).toBe('Mary-Jane')
  })

  it('should remove special characters', () => {
    expect(sanitizeName('John@#$Doe')).toBe('JohnDoe')
  })

  it('should remove emoji', () => {
    expect(sanitizeName('John 😀 Doe')).toBe('John  Doe')
  })

  it('should remove Unicode control characters', () => {
    expect(sanitizeName('John\u0000Doe')).toBe('JohnDoe')
  })

  it('should trim whitespace', () => {
    expect(sanitizeName('  John Doe  ')).toBe('John Doe')
  })

  it('should enforce max length (20 characters)', () => {
    const longName = 'A'.repeat(30)
    const result = sanitizeName(longName)
    expect(result.length).toBe(20)
  })

  it('should handle null input', () => {
    expect(sanitizeName(null)).toBe('')
  })

  it('should handle undefined input', () => {
    expect(sanitizeName(undefined)).toBe('')
  })

  it('should handle empty string', () => {
    expect(sanitizeName('')).toBe('')
  })

  it('should handle non-string input', () => {
    expect(sanitizeName(123)).toBe('')
    expect(sanitizeName({})).toBe('')
    expect(sanitizeName([])).toBe('')
  })

  it('should handle string with only special characters', () => {
    expect(sanitizeName('@#$%^&*()')).toBe('')
  })

  it('should preserve underscores (word characters)', () => {
    expect(sanitizeName('John_Doe')).toBe('John_Doe')
  })

  it('should handle mixed valid and invalid characters', () => {
    expect(sanitizeName('John!@# Doe$%^')).toBe('John Doe')
  })
})
