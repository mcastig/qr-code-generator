import { useState, type FormEvent } from 'react'
import './UrlForm.css'

type UrlFormProps = {
  onSubmit: (url: string) => void
}

function UrlForm({ onSubmit }: UrlFormProps) {
  const [value, setValue] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form className="url-form" onSubmit={handleSubmit} role="search">
      <input
        type="text"
        inputMode="url"
        className="url-form__input"
        placeholder="Enter an url"
        aria-label="URL"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        autoFocus
      />
      <button
        type="submit"
        className="url-form__submit"
        disabled={value.trim().length === 0}
      >
        QR code
      </button>
    </form>
  )
}

export default UrlForm
