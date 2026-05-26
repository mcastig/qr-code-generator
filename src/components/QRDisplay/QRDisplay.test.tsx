import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import QRCode from 'qrcode'
import QRDisplay from './QRDisplay'

describe('QRDisplay', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('renders Download and Share buttons', () => {
    render(<QRDisplay url="https://example.com" />)
    expect(
      screen.getByRole('button', { name: /download/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
  })

  it('copies the URL and resets status after the timeout', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    render(<QRDisplay url="https://example.com" />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    expect(writeText).toHaveBeenCalledWith('https://example.com')
    await waitFor(() =>
      expect(screen.getByText(/url copied to clipboard/i)).toBeInTheDocument(),
    )

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000)
    })
    expect(
      screen.queryByText(/url copied to clipboard/i),
    ).not.toBeInTheDocument()
  })

  it('shows an error message when clipboard write fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'))
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    render(<QRDisplay url="https://example.com" />)
    fireEvent.click(screen.getByRole('button', { name: /share/i }))

    await waitFor(() =>
      expect(screen.getByText(/could not copy the url/i)).toBeInTheDocument(),
    )
  })

  it('silently swallows QR generation failures', async () => {
    const sawCatch = vi.fn()
    vi.spyOn(QRCode, 'toCanvas').mockImplementation(() => {
      const rejected = Promise.reject(new Error('boom'))
      rejected.catch(sawCatch)
      return rejected
    })

    render(<QRDisplay url="https://example.com" />)

    await waitFor(() => expect(sawCatch).toHaveBeenCalled())
    expect(
      screen.getByRole('button', { name: /download/i }),
    ).toBeInTheDocument()
  })

  it('triggers a PNG download when Download is clicked', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
      'data:image/png;base64,abc',
    )
    const click = vi.fn()
    const realCreate = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag, options) => {
      const el = realCreate(tag, options)
      if (tag === 'a') el.click = click
      return el
    })

    render(<QRDisplay url="https://example.com" />)
    fireEvent.click(screen.getByRole('button', { name: /download/i }))

    expect(click).toHaveBeenCalledTimes(1)
  })
})
