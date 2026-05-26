import { useEffect, useState } from 'react'
import './ThemeToggle.css'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'qr-theme'

function getInitialTheme(): Theme {
  const saved = window.localStorage.getItem(STORAGE_KEY)
  return saved === 'light' ? 'light' : 'dark'
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 3v2" />
            <path d="M12 19v2" />
            <path d="M3 12h2" />
            <path d="M19 12h2" />
            <path d="M5.6 5.6l1.4 1.4" />
            <path d="M17 17l1.4 1.4" />
            <path d="M5.6 18.4L7 17" />
            <path d="M17 7l1.4-1.4" />
          </g>
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
