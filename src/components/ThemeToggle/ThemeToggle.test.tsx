import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import ThemeToggle from './ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('starts in dark mode by default', () => {
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('reads the saved theme from localStorage on mount', () => {
    window.localStorage.setItem('qr-theme', 'light')
    render(<ThemeToggle />)
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('switches theme on click and persists the choice', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(window.localStorage.getItem('qr-theme')).toBe('light')

    await user.click(screen.getByRole('button'))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(window.localStorage.getItem('qr-theme')).toBe('dark')
  })
})
