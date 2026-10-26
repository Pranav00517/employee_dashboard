import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data')
        return res.json()
      })
      .then(data => { setEmployees(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  const filtered = employees.filter(
    emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = name =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Employee Dashboard</h1>
        <p className="page-subtitle">Manage and monitor your team members</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div>
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🏢</div>
          <div>
            <div className="stat-value">
              {new Set(employees.map(e => e.company?.name)).size}
            </div>
            <div className="stat-label">Companies</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📍</div>
          <div>
            <div className="stat-value">
              {new Set(employees.map(e => e.address?.city)).size}
            </div>
            <div className="stat-label">Cities</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🌐</div>
          <div>
            <div className="stat-value">{employees.filter(e => e.website).length}</div>
            <div className="stat-label">With Website</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar-wrapper">
        <div className="search-input-group">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="table-header-row">
          <span className="table-title">Employee List</span>
          <span className="table-badge">{filtered.length} Records</span>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="spinner-ring" />
            <p className="loading-text">Fetching employees…</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-msg">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table className="emp-table">
              <thead>
                <tr>
                  <th>#&nbsp;ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No employees match your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map(emp => (
                    <tr key={emp.id}>
                      <td>
                        <span className="id-badge">{emp.id}</span>
                      </td>
                      <td>
                        <div className="name-cell">
                          <div className="avatar">{getInitials(emp.name)}</div>
                          <div>
                            <div className="name-text">{emp.name}</div>
                            <div className="name-sub">@{emp.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <a href={`mailto:${emp.email}`} className="email-link">
                          {emp.email}
                        </a>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {emp.phone}
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        📍 {emp.address?.city}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
