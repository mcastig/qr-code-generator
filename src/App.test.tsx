import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders the URL form initially', () => {
    render(<App />)
    expect(screen.getByPlaceholderText(/enter an url/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /download/i }),
    ).not.toBeInTheDocument()
  })

  it('shows the QR view after submitting a URL and can return to the form', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.type(screen.getByLabelText(/url/i), 'https://example.com')
    await user.click(screen.getByRole('button', { name: /qr code/i }))

    expect(
      screen.getByRole('button', { name: /download/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /generate another/i }))

    expect(screen.getByPlaceholderText(/enter an url/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /download/i }),
    ).not.toBeInTheDocument()
  })
})
