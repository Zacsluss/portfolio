import { Component } from 'react'
import PropTypes from 'prop-types'
import { logger } from '../../utils/logger'

/**
 * Error Boundary component to catch and display React component errors
 * Prevents full application crashes and provides graceful error handling
 *
 * Usage:
 *   <ErrorBoundary>
 *     <YourApp />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error with structured logging
    logger.error('React Error Boundary caught error', {
      error: error.toString(),
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    })

    // Store error info in state
    this.setState({ errorInfo })

    // In production, you could send errors to a monitoring service here
    // Example: Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '2rem',
            textAlign: 'center',
            backgroundColor: '#000',
            color: '#fff',
          }}
        >
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ff006e' }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#aaa' }}>
            We're sorry for the inconvenience. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#00ff88',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Refresh Page
          </button>

          {/* Show error details in development mode only */}
          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                maxWidth: '800px',
                textAlign: 'left',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#ff006e',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                }}
              >
                Error Details (Development Mode)
              </summary>
              <pre
                style={{
                  fontSize: '0.9rem',
                  color: '#00ff88',
                  overflow: 'auto',
                  maxHeight: '300px',
                }}
              >
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
}
