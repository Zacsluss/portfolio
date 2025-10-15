import { render, screen } from '@testing-library/react'
import { Section } from './Section'

describe('Section', () => {
  it('should render children', () => {
    render(
      <Section id="test">
        <div>Test content</div>
      </Section>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should apply id attribute', () => {
    const { container } = render(
      <Section id="about">
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('#about')
    expect(section).toBeInTheDocument()
  })

  it('should apply content-section class', () => {
    const { container } = render(
      <Section id="test">
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('.content-section')
    expect(section).toBeInTheDocument()
  })

  it('should apply fade class when visible and fadeDelay is provided', () => {
    const { container } = render(
      <Section id="test" fadeDelay={2} visible={true}>
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('.fade-in-2')
    expect(section).toBeInTheDocument()
  })

  it('should not apply fade class when not visible', () => {
    const { container } = render(
      <Section id="test" fadeDelay={2} visible={false}>
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('.fade-in-2')
    expect(section).not.toBeInTheDocument()
  })

  it('should not apply fade class when fadeDelay is 0', () => {
    const { container } = render(
      <Section id="test" fadeDelay={0} visible={true}>
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('[class*="fade-in"]')
    expect(section).not.toBeInTheDocument()
  })

  it('should default to visible=true', () => {
    const { container } = render(
      <Section id="test" fadeDelay={3}>
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('.fade-in-3')
    expect(section).toBeInTheDocument()
  })

  it('should default to fadeDelay=0', () => {
    const { container } = render(
      <Section id="test">
        <div>Content</div>
      </Section>
    )

    const section = container.querySelector('[class*="fade-in"]')
    expect(section).not.toBeInTheDocument()
  })

  it('should handle multiple children', () => {
    render(
      <Section id="test">
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </Section>
    )

    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
    expect(screen.getByText('Child 3')).toBeInTheDocument()
  })

  it('should apply correct fade class for different delays', () => {
    const delays = [1, 2, 3, 4, 5, 6]

    delays.forEach((delay) => {
      const { container } = render(
        <Section id={`test-${delay}`} fadeDelay={delay} visible={true}>
          <div>Content</div>
        </Section>
      )

      const section = container.querySelector(`.fade-in-${delay}`)
      expect(section).toBeInTheDocument()
    })
  })
})
