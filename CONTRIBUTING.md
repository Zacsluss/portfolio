# Contributing

Thanks for your interest in this project! This is a personal portfolio, but I welcome:

- **Bug reports:** Open an issue with reproduction steps
- **Performance suggestions:** Share your ideas in discussions
- **Forks:** Feel free to fork and customize for your own portfolio

## Development Setup

```bash
git clone [repository-url]
cd portfolio
npm install
npm run dev
```

The development server will start at `http://localhost:2945/portfolio/` by default

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   ├── particles/     # Custom WebGL particle systems
│   │   ├── sections/      # Portfolio content sections
│   │   └── ui/            # Reusable UI components
│   ├── config/            # Application constants
│   ├── data/              # Portfolio content data
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── App.jsx            # Main application
├── public/                # Static assets
└── vite.config.js         # Build configuration
```

## Code Style

- **Formatting:** Run `npm run lint` before committing
- **Naming:** Use camelCase for variables, PascalCase for components
- **Comments:** Add JSDoc comments for exported functions
- **Constants:** Use UPPER_SNAKE_CASE for constants in `src/config/`

## Making Changes

1. **Small fixes:** Feel free to open a PR directly
2. **New features:** Open an issue first to discuss the approach
3. **Performance improvements:** Include before/after benchmarks

### Code Quality Checklist

Before submitting a PR:

- [ ] Code passes `npm run lint`
- [ ] No console.log statements (they're removed in production)
- [ ] Magic numbers extracted to constants
- [ ] Complex logic has comments explaining "why"
- [ ] Bundle size stays under 350KB gzipped

## Performance Guidelines

This project has strict performance targets:

| Metric | Target |
|--------|--------|
| Bundle size (gzip) | <350KB |
| FPS (desktop) | 60 |
| FPS (mobile) | 30 |
| Initial load (3G) | <3s |

**Performance tips:**
- Use `React.lazy()` for code splitting
- Keep shader code minimal (runs on GPU every frame)
- Test on mobile devices, not just desktop
- Check bundle size with `npm run build`

## Pull Requests

While this is a personal project, I'll consider PRs for:

✅ **Bug fixes**
- Broken links
- Visual glitches
- Performance regressions
- Accessibility improvements

✅ **Documentation**
- README clarifications
- Code comments
- Setup instructions

✅ **Refactoring**
- Better code organization
- Reduced duplication
- Improved error handling

❌ **Content changes**
- This is my personal portfolio content
- Fork the project to customize for yourself

## Testing

Currently, this project has minimal test coverage. If you want to contribute tests:

```bash
npm install -D vitest @testing-library/react
npm run test
```

Priority test areas:
- Data schema validation
- Hook behavior (useKonamiCode)
- Device detection logic
- Input sanitization

## Questions?

Open an issue or reach out via:
- **Email:** zacharyjsluss@gmail.com
- **LinkedIn:** [linkedin.com/in/zacharyjsluss](https://linkedin.com/in/zacharyjsluss)

Thank you for contributing! 🎉
