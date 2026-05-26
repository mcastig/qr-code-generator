import { useState } from 'react'
import Header from './components/Header/Header'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import UrlForm from './components/UrlForm/UrlForm'
import QRDisplay from './components/QRDisplay/QRDisplay'
import './App.css'

function App() {
  const [url, setUrl] = useState<string | null>(null)

  const reset = () => setUrl(null)
  const hasQr = url !== null

  return (
    <div className="app">
      <ThemeToggle />

      <main className={`app__main ${hasQr ? 'app__main--result' : ''}`}>
        <Header compact={hasQr} />

        {hasQr ? (
          <>
            <QRDisplay url={url} />
            <button type="button" className="app__back" onClick={reset}>
              Generate another
            </button>
          </>
        ) : (
          <UrlForm onSubmit={setUrl} />
        )}
      </main>
    </div>
  )
}

export default App
