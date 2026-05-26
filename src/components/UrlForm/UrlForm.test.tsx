import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import UrlForm from './UrlForm'

describe('UrlForm', () => {
  it('disables the submit button when the input is empty', () => {
    render(<UrlForm onSubmit={() => {}} />)
    expect(screen.getByRole('button', { name: /qr code/i })).toBeDisabled()
  })

  it('enables the submit button once a value is typed', async () => {
    const user = userEvent.setup()
    render(<UrlForm onSubmit={() => {}} />)
    await user.type(screen.getByLabelText(/url/i), 'x')
    expect(screen.getByRole('button', { name: /qr code/i })).toBeEnabled()
  })

  it('calls onSubmit with the trimmed URL', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<UrlForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/url/i), '  https://example.com  ')
    await user.click(screen.getByRole('button', { name: /qr code/i }))

    expect(onSubmit).toHaveBeenCalledWith('https://example.com')
  })

  it('does not call onSubmit when the form is submitted with no value', () => {
    const onSubmit = vi.fn()
    const { container } = render(<UrlForm onSubmit={onSubmit} />)

    fireEvent.submit(container.querySelector('form')!)

    expect(onSubmit).not.toHaveBeenCalled()
  })
})
