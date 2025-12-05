# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-20

### Added
- **Testing Infrastructure**: Complete Vitest setup with 68 tests across 6 test suites
  - Schema validation tests (15 tests)
  - Utility function tests for sanitization and device detection (28 tests)
  - useKonamiCode hook tests (8 tests)
  - Component tests for ErrorBoundary and Section (11 tests)
- **CI/CD**: GitHub Actions workflow with automated linting, testing, and build verification
- **Code Quality**: ErrorBoundary component for graceful error handling
- **Performance**: Scroll throttling with requestAnimationFrame (95% reduction in handler calls)
- **Security**: Input sanitization and schema validation
- **Architecture**: Centralized configuration constants and reusable utility modules
- **Documentation**: Comprehensive README, CONTRIBUTING.md, and inline JSDoc comments

### Changed
- Extracted all magic numbers to centralized `src/config/constants.js`
- Refactored useKonamiCode hook to eliminate memory leak
- Created reusable Section wrapper component (83% code reduction)
- Split device detection logic into dedicated utility module
- Updated package.json to version 1.0.0 (production-ready)

### Fixed
- Memory leak in useKonamiCode hook from accumulating event listeners
- Bundle size optimization (303KB gzipped with code splitting)
- ESLint configuration for React 19 and Three.js compatibility

## [0.0.0] - Initial Development

### Added
- 30,000 GPU-accelerated particle system with Three.js
- Custom GLSL shaders for particle effects
- Real-time text morphing with user input
- Responsive design with mobile optimization (10K particles)
- Portfolio sections: About, Skills, Experience, Leadership, Contact.
- Interactive 3D space environment with orbital controls
- Konami Code easter egg with supernova effect

