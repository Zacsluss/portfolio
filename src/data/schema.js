/**
 * Portfolio data validation schema
 * Validates the structure of portfolio-data.js to catch errors early
 */

/**
 * Validates portfolio data structure
 * @param {Object} data - Portfolio data to validate
 * @throws {Error} if data is malformed
 * @returns {boolean} true if valid
 */
export function validatePortfolioData(data) {
  // Validate personal information
  if (!data.personal) {
    throw new Error('Missing personal section')
  }

  if (!data.personal.name || typeof data.personal.name !== 'string') {
    throw new Error('Missing or invalid personal.name')
  }

  if (!data.personal.email || !isValidEmail(data.personal.email)) {
    throw new Error('Missing or invalid personal.email')
  }

  if (!data.personal.title || typeof data.personal.title !== 'string') {
    throw new Error('Missing or invalid personal.title')
  }

  // Validate experience array
  if (!Array.isArray(data.experience)) {
    throw new Error('experience must be an array')
  }

  data.experience.forEach((exp, i) => {
    if (!exp.company || typeof exp.company !== 'string') {
      throw new Error(`experience[${i}]: missing or invalid company`)
    }

    if (!exp.position || typeof exp.position !== 'string') {
      throw new Error(`experience[${i}]: missing or invalid position`)
    }

    if (!exp.startDate || !isValidDate(exp.startDate)) {
      throw new Error(`experience[${i}]: missing or invalid startDate (expected YYYY-MM format)`)
    }

    if (exp.endDate && !isValidDate(exp.endDate)) {
      throw new Error(`experience[${i}]: invalid endDate (expected YYYY-MM format)`)
    }

    if (!Array.isArray(exp.achievements)) {
      throw new Error(`experience[${i}]: achievements must be an array`)
    }

    if (!Array.isArray(exp.technologies)) {
      throw new Error(`experience[${i}]: technologies must be an array`)
    }
  })

  // Validate skills array
  if (!Array.isArray(data.skills)) {
    throw new Error('skills must be an array')
  }

  data.skills.forEach((skillGroup, i) => {
    if (!skillGroup.category || typeof skillGroup.category !== 'string') {
      throw new Error(`skills[${i}]: missing or invalid category`)
    }

    if (!Array.isArray(skillGroup.skills)) {
      throw new Error(`skills[${i}]: skills must be an array`)
    }

    skillGroup.skills.forEach((skill, j) => {
      if (!skill.name || typeof skill.name !== 'string') {
        throw new Error(`skills[${i}].skills[${j}]: missing or invalid name`)
      }

      const validLevels = ['Expert', 'Advanced', 'Intermediate', 'Beginner']
      if (!skill.level || !validLevels.includes(skill.level)) {
        throw new Error(
          `skills[${i}].skills[${j}]: invalid level (expected one of: ${validLevels.join(', ')})`
        )
      }
    })
  })

  // Validate additional links (if present)
  if (data.additionalLinks && !Array.isArray(data.additionalLinks)) {
    throw new Error('additionalLinks must be an array')
  }

  if (data.additionalLinks) {
    data.additionalLinks.forEach((link, i) => {
      if (!link.title || typeof link.title !== 'string') {
        throw new Error(`additionalLinks[${i}]: missing or invalid title`)
      }

      if (!link.url || !isValidUrl(link.url)) {
        throw new Error(`additionalLinks[${i}]: missing or invalid url`)
      }

      if (!link.category || typeof link.category !== 'string') {
        throw new Error(`additionalLinks[${i}]: missing or invalid category`)
      }
    })
  }

  // Validate social links (if present)
  if (data.social && typeof data.social !== 'object') {
    throw new Error('social must be an object')
  }

  if (data.social) {
    Object.entries(data.social).forEach(([key, value]) => {
      if (value && !isValidUrl(value)) {
        throw new Error(`social.${key}: invalid url`)
      }
    })
  }

  return true
}

/**
 * Validates email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/
  return emailRegex.test(email)
}

/**
 * Validates date format (YYYY-MM)
 * @param {string} date
 * @returns {boolean}
 */
function isValidDate(date) {
  const dateRegex = /^\d{4}-\d{2}$/
  return dateRegex.test(date)
}

/**
 * Validates URL format
 * @param {string} url
 * @returns {boolean}
 */
function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
