import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import './QRDisplay.css'

type QRDisplayProps = {
  url: string
}

const QR_SIZE = 240
const STATUS_RESET_MS = 2000

const ignore = () => undefined

function QRDisplay({ url }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  )

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement)
    const dark = styles.getPropertyValue('--color-dark').trim()
    const light = styles.getPropertyValue('--color-paper').trim()
    QRCode.toCanvas(canvasRef.current!, url, {
      width: QR_SIZE,
      margin: 1,
      color: { dark, light },
      errorCorrectionLevel: 'M',
    }).catch(ignore)
  }, [url])

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = canvasRef.current!.toDataURL('image/png')
    link.download = 'qr-code.png'
    link.click()
  }

  const resetStatus = () => setShareStatus('idle')

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setShareStatus('copied')
    } catch {
      setShareStatus('error')
    }
    window.setTimeout(resetStatus, STATUS_RESET_MS)
  }

  return (
    <div className="qr-display">
      <div className="qr-display__halo">
        <div className="qr-display__card">
          <canvas
            ref={canvasRef}
            className="qr-display__canvas"
            width={QR_SIZE}
            height={QR_SIZE}
            aria-label={`QR code for ${url}`}
            role="img"
          />
        </div>
      </div>

      <div className="qr-display__actions">
        <button
          type="button"
          className="qr-display__button"
          onClick={handleDownload}
        >
          Download
          <img src="/icon-download.svg" alt="" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="qr-display__button"
          onClick={handleShare}
        >
          {shareStatus === 'copied' ? 'Copied!' : 'Share'}
          <img src="/icon-link.svg" alt="" aria-hidden="true" />
        </button>
      </div>

      <p className="qr-display__status" role="status" aria-live="polite">
        {shareStatus === 'copied'
          ? 'URL copied to clipboard'
          : shareStatus === 'error'
            ? 'Could not copy the URL'
            : ''}
      </p>
    </div>
  )
}

export default QRDisplay
