import './Header.css'

type HeaderProps = {
  compact?: boolean
}

function Header({ compact = false }: HeaderProps) {
  return (
    <header className={`header ${compact ? 'header--compact' : ''}`}>
      <img
        src={`${import.meta.env.BASE_URL}${compact ? 'Logo-small.svg' : 'Logo.svg'}`}
        alt="QRCODE"
        className="header__logo"
      />
    </header>
  )
}

export default Header
