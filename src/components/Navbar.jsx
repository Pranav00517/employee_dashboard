import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar-custom">
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        {/* Brand */}
        <NavLink to="/" className="navbar-brand-custom">
          <div className="brand-icon">👥</div>
          <span>EmpBoard</span>
        </NavLink>

        {/* Nav Links */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
          >
            <span>🏠</span> Home
          </NavLink>
          <NavLink
            to="/employee-form"
            className={({ isActive }) => `nav-link-custom${isActive ? ' active' : ''}`}
          >
            <span>📋</span> Employee Form
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
