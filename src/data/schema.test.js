import { validatePortfolioData } from './schema'

describe('validatePortfolioData', () => {
  const validData = {
    personal: {
      name: 'John Doe',
      email: 'john@example.com',
      title: 'Software Engineer',
    },
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Engineer',
        startDate: '2020-01',
        endDate: '2023-12',
        achievements: ['Built features', 'Led team'],
        technologies: ['React', 'Node.js'],
      },
    ],
    skills: [
      {
        category: 'Frontend',
        skills: [
          { name: 'React', level: 'Expert' },
          { name: 'Vue', level: 'Advanced' },
        ],
      },
    ],
    additionalLinks: [
      {
        title: 'My Project',
        url: 'https://example.com',
        category: 'Projects',
      },
    ],
    social: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
    },
  }

  it('should validate correct portfolio data', () => {
    expect(() => validatePortfolioData(validData)).not.toThrow()
  })

  it('should throw error if personal section is missing', () => {
    const data = { ...validData, personal: undefined }
    expect(() => validatePortfolioData(data)).toThrow('Missing personal section')
  })

  it('should throw error if personal.name is missing', () => {
    const data = {
      ...validData,
      personal: { ...validData.personal, name: undefined },
    }
    expect(() => validatePortfolioData(data)).toThrow('Missing or invalid personal.name')
  })

  it('should throw error if personal.email is invalid', () => {
    const data = {
      ...validData,
      personal: { ...validData.personal, email: 'invalid-email' },
    }
    expect(() => validatePortfolioData(data)).toThrow('Missing or invalid personal.email')
  })

  it('should throw error if experience is not an array', () => {
    const data = { ...validData, experience: 'not an array' }
    expect(() => validatePortfolioData(data)).toThrow('experience must be an array')
  })

  it('should throw error if experience item is missing company', () => {
    const data = {
      ...validData,
      experience: [{ ...validData.experience[0], company: undefined }],
    }
    expect(() => validatePortfolioData(data)).toThrow('missing or invalid company')
  })

  it('should throw error if experience startDate has wrong format', () => {
    const data = {
      ...validData,
      experience: [{ ...validData.experience[0], startDate: '2020/01/01' }],
    }
    expect(() => validatePortfolioData(data)).toThrow('expected YYYY-MM format')
  })

  it('should accept experience without endDate (current role)', () => {
    const data = {
      ...validData,
      experience: [{ ...validData.experience[0], endDate: undefined }],
    }
    expect(() => validatePortfolioData(data)).not.toThrow()
  })

  it('should throw error if skills is not an array', () => {
    const data = { ...validData, skills: {} }
    expect(() => validatePortfolioData(data)).toThrow('skills must be an array')
  })

  it('should throw error if skill level is invalid', () => {
    const data = {
      ...validData,
      skills: [
        {
          category: 'Frontend',
          skills: [{ name: 'React', level: 'God Mode' }],
        },
      ],
    }
    expect(() => validatePortfolioData(data)).toThrow('invalid level')
  })

  it('should accept valid skill levels', () => {
    const levels = ['Expert', 'Advanced', 'Intermediate', 'Beginner']
    levels.forEach((level) => {
      const data = {
        ...validData,
        skills: [
          {
            category: 'Test',
            skills: [{ name: 'Test Skill', level }],
          },
        ],
      }
      expect(() => validatePortfolioData(data)).not.toThrow()
    })
  })

  it('should throw error if additionalLinks url is invalid', () => {
    const data = {
      ...validData,
      additionalLinks: [
        {
          title: 'Project',
          url: 'not-a-url',
          category: 'Projects',
        },
      ],
    }
    expect(() => validatePortfolioData(data)).toThrow('invalid url')
  })

  it('should throw error if social url is invalid', () => {
    const data = {
      ...validData,
      social: {
        github: 'not-a-url',
      },
    }
    expect(() => validatePortfolioData(data)).toThrow('social.github: invalid url')
  })

  it('should accept optional social fields', () => {
    const data = {
      ...validData,
      social: undefined,
    }
    expect(() => validatePortfolioData(data)).not.toThrow()
  })

  it('should return true when validation passes', () => {
    const result = validatePortfolioData(validData)
    expect(result).toBe(true)
  })
})
