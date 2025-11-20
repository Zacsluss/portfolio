import PropTypes from 'prop-types'

/**
 * Reusable section wrapper component with conditional fade-in animation
 * Reduces code duplication across App.jsx section definitions
 *
 * @param {string} id - HTML id attribute for anchor linking
 * @param {React.ReactNode} children - Section content
 * @param {number} fadeDelay - Fade-in animation delay number (e.g., 2 for fade-in-2)
 * @param {boolean} visible - Whether to show the section (triggers fade-in)
 * @returns {JSX.Element}
 */
export function Section({ id, children, fadeDelay = 0, visible = true }) {
  const fadeClass = visible && fadeDelay > 0 ? `fade-in-${fadeDelay}` : ''

  return (
    <div id={id} className={`content-section ${fadeClass}`}>
      {children}
    </div>
  )
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  fadeDelay: PropTypes.number,
  visible: PropTypes.bool,
}
