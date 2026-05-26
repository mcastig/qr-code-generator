import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from './Header'

describe('Header', () => {
  it('renders the full logo by default', () => {
    render(<Header />)
    const logo = screen.getByAltText('QRCODE') as HTMLImageElement
    expect(logo.src).toContain('/Logo.svg')
  })

  it('renders the small logo when compact', () => {
    render(<Header compact />)
    const logo = screen.getByAltText('QRCODE') as HTMLImageElement
    expect(logo.src).toContain('/Logo-small.svg')
  })
})
