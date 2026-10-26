import { useState, useEffect } from 'react'

const API = 'http://localhost:5000/api/employees'

export default function Dashboard() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)   // single-employee detail modal
  const [deleting, setDeleting]   = useState(null)   // id being deleted

  const fetchAll = () => {
    setLoading(true)
    setError(null)
    fetch(API)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch employees')
        return res.json()
      })
      .then(data => { setEmployees(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  useEffect(() => { fetchAll() }, [])

  const handleViewOne = id => {
    fetch(`${API}/${id}`)
      .then(res => res.json())
      .then(data => setSelected(data))
      .catch(() => {})
  }

  const handleDelete = id => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return
    setDeleting(id)
    fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed')
        setEmployees(prev => prev.filter(e => e._id !== id))
        if (selected?._id === id) setSelected(null)
      })
      .catch(err => alert(err.message))
      .finally(() => setDeleting(null))
  }

  const filtered = employees.filter(
    emp =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.designation?.toLowerCase().includes(search.toLowerCase()) ||
      emp.location?.toLowerCase().includes(search.toLowerCase())
  )

  const getInitials = name =>
    name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  const formatSalary = val =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  return (
    <div className="page-wrapper">
      {/* Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>&#x2715;</button>
            <div className="modal-avatar">{getInitials(selected.name)}</div>
            <h2 className="modal-name">{selected.name}</h2>
            <span className="modal-role">{selected.designation}</span>
            <ul className="preview-list" style={{ marginTop: '1.5rem' }}>
              <li className="preview-item">
                <span className="preview-label">Location</span>
                <span className="preview-value">&#x1F4CD; {selected.location}</span>
              </li>
              <li className="preview-item">
                <span className="preview-label">Salary</span>
                <span className="salary-badge">{formatSalary(selected.salary)}</span>
              </li>
              <li className="preview-item">
                <span className="preview-label">Added</span>
                <span className="preview-value">{new Date(selected.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </li>
            </ul>
            <button
              className="btn-submit"
              style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg,#ef4444,#dc2626)', boxShadow: '0 4px 20px rgba(239,68,68,0.35)' }}
              onClick={() => { handleDelete(selected._id); setSelected(null) }}
            >
              &#x1F5D1; Delete Employee
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Employee Dashboard</h1>
        <p className="page-subtitle">Manage and monitor your team members</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">&#x1F465;</div>
          <div>
            <div className="stat-value">{employees.length}</div>
            <div className="stat-label">Total Employees</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">&#x1F4BC;</div>
          <div>
            <div className="stat-value">{new Set(employees.map(e => e.designation)).size}</div>
            <div className="stat-label">Designations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">&#x1F4CD;</div>
          <div>
            <div className="stat-value">{new Set(employees.map(e => e.location)).size}</div>
            <div className="stat-label">Locations</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">&#x1F4B0;</div>
          <div>
            <div className="stat-value">
              {employees.length
                ? formatSalary(employees.reduce((s, e) => s + (e.salary || 0), 0) / employees.length)
                : '—'}
            </div>
            <div className="stat-label">Avg. Salary</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar-wrapper">
        <div className="search-input-group">
          <span className="search-icon">&#x1F50D;</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, role or city..."
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
            <p className="loading-text">Fetching employees&#x2026;</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <span className="error-icon">&#x26A0;&#xFE0F;</span>
            <p className="error-msg">{error}</p>
            <button className="btn-submit" style={{ width: 'auto', marginTop: '1rem' }} onClick={fetchAll}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table className="emp-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((emp, idx) => (
                    <tr key={emp._id}>
                      <td><span className="id-badge">{idx + 1}</span></td>
                      <td>
                        <div className="name-cell">
                          <div className="avatar">{getInitials(emp.name)}</div>
                          <div className="name-text">{emp.name}</div>
                        </div>
                      </td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{emp.designation}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>&#x1F4CD; {emp.location}</td>
                      <td><span className="salary-badge">{formatSalary(emp.salary)}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn-action view" onClick={() => handleViewOne(emp._id)} title="View Details">&#x1F441;</button>
                          <button className="btn-action delete" onClick={() => handleDelete(emp._id)} disabled={deleting === emp._id} title="Delete">
                            {deleting === emp._id ? '&#x2026;' : '&#x1F5D1;'}
                          </button>
                        </div>
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
