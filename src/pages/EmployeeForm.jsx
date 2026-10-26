import { useState } from 'react'

const API = 'http://localhost:5000/api/employees'

const DESIGNATIONS = [
  'Software Engineer', 'Senior Engineer', 'Tech Lead', 'Product Manager',
  'UI/UX Designer', 'DevOps Engineer', 'QA Engineer', 'Data Analyst',
  'HR Manager', 'Project Manager',
]

const LOCATIONS = [
  'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad',
  'Pune', 'Kolkata', 'Ahmedabad', 'Remote',
]

const initialState = { name: '', designation: '', location: '', salary: '' }

export default function EmployeeForm() {
  const [form, setForm]           = useState(initialState)
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [records, setRecords]     = useState([])
  const [apiError, setApiError]   = useState(null)

  // ---- Validation ----
  const validate = () => {
    const e = {}
    if (!form.name.trim())               e.name        = 'Name is required.'
    else if (form.name.trim().length < 3) e.name       = 'Name must be at least 3 characters.'
    if (!form.designation)               e.designation = 'Please select a designation.'
    if (!form.location)                  e.location    = 'Please select a location.'
    if (!form.salary)                    e.salary      = 'Salary is required.'
    else if (isNaN(form.salary) || Number(form.salary) <= 0)
                                         e.salary      = 'Enter a valid positive salary.'
    return e
  }

  // ---- Handlers ----
  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setApiError(null)

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        form.name.trim(),
          designation: form.designation,
          location:    form.location,
          salary:      Number(form.salary),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Server error. Please try again.')
      }

      const saved = await res.json()
      setRecords(prev => [saved, ...prev])
      setSubmitted(saved)
      setForm(initialState)
      setErrors({})
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3500)
    } catch (err) {
      setApiError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(initialState)
    setErrors({})
    setSubmitted(null)
    setApiError(null)
  }

  const formatSalary = val =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)

  // ---- Render ----
  return (
    <div className="page-wrapper">
      {/* Toast */}
      {showToast && (
        <div className="toast-overlay">
          <div className="toast-card">
            <div className="toast-icon">&#x2705;</div>
            <div>
              <div className="toast-title">Employee Added!</div>
              <div className="toast-msg">Record saved to MongoDB Atlas.</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Add New Employee</h1>
        <p className="page-subtitle">Fill in the details to register a new team member</p>
      </div>

      <div className="form-wrapper">
        {/* Form Card */}
        <div className="form-card">
          <p className="form-section-title">&#x1F539; Personal &amp; Role Details</p>

          {apiError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.2rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
              &#x26A0;&#xFE0F; {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="form-group-custom">
              <label className="form-label-custom" htmlFor="name">
                <span className="label-icon">&#x1F464;</span> Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-control-custom${errors.name ? ' is-invalid' : ''}`}
                placeholder="e.g. Aarav Sharma"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && (
                <div className="invalid-feedback-custom">&#x26A0;&#xFE0F; {errors.name}</div>
              )}
            </div>

            {/* Designation + Location */}
            <div className="form-grid">
              <div className="form-group-custom" style={{ margin: 0 }}>
                <label className="form-label-custom" htmlFor="designation">
                  <span className="label-icon">&#x1F4BC;</span> Designation
                </label>
                <select
                  id="designation"
                  name="designation"
                  className={`form-control-custom${errors.designation ? ' is-invalid' : ''}`}
                  value={form.designation}
                  onChange={handleChange}
                >
                  <option value="">Select designation&#x2026;</option>
                  {DESIGNATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.designation && (
                  <div className="invalid-feedback-custom">&#x26A0;&#xFE0F; {errors.designation}</div>
                )}
              </div>

              <div className="form-group-custom" style={{ margin: 0 }}>
                <label className="form-label-custom" htmlFor="location">
                  <span className="label-icon">&#x1F4CD;</span> Location
                </label>
                <select
                  id="location"
                  name="location"
                  className={`form-control-custom${errors.location ? ' is-invalid' : ''}`}
                  value={form.location}
                  onChange={handleChange}
                >
                  <option value="">Select location&#x2026;</option>
                  {LOCATIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                {errors.location && (
                  <div className="invalid-feedback-custom">&#x26A0;&#xFE0F; {errors.location}</div>
                )}
              </div>
            </div>

            {/* Salary */}
            <div className="form-group-custom" style={{ marginTop: '1.4rem' }}>
              <label className="form-label-custom" htmlFor="salary">
                <span className="label-icon">&#x1F4B0;</span> Monthly Salary (&#x20B9;)
              </label>
              <input
                id="salary"
                name="salary"
                type="number"
                min="1"
                className={`form-control-custom${errors.salary ? ' is-invalid' : ''}`}
                placeholder="e.g. 75000"
                value={form.salary}
                onChange={handleChange}
              />
              {errors.salary && (
                <div className="invalid-feedback-custom">&#x26A0;&#xFE0F; {errors.salary}</div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'start', marginTop: '0.5rem' }}>
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? '&#x23F3; Saving&#x2026;' : '&#x271A; Add Employee'}
              </button>
              <button type="button" className="btn-reset" onClick={handleReset}>
                &#x21BA; Reset
              </button>
            </div>
          </form>
        </div>

        {/* Submitted Records */}
        {records.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
              &#x1F4C4; Submitted Records ({records.length})
            </h2>
            {records.map(rec => (
              <div
                key={rec._id}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1.2rem 1.6rem',
                  marginBottom: '0.8rem',
                  borderLeft: '3px solid var(--primary)',
                }}
              >
                <ul className="preview-list">
                  <li className="preview-item">
                    <span className="preview-label">Name</span>
                    <span className="preview-value">{rec.name}</span>
                  </li>
                  <li className="preview-item">
                    <span className="preview-label">Designation</span>
                    <span className="preview-value">{rec.designation}</span>
                  </li>
                  <li className="preview-item">
                    <span className="preview-label">Location</span>
                    <span className="preview-value">&#x1F4CD; {rec.location}</span>
                  </li>
                  <li className="preview-item">
                    <span className="preview-label">Salary</span>
                    <span className="salary-badge">{formatSalary(rec.salary)}</span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
