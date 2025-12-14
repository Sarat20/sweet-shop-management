import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import '../index.css'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/auth/register', { name, email, password })
      setName('')
      setEmail('')
      setPassword('')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
      setName('')
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#fafafa' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fc8019', marginBottom: '8px' }}>Create Account</h2>
          <p style={{ color: '#666', fontSize: '16px' }}>Join us today</p>
        </div>
        
        {error && (
          <div style={{ background: '#fff5f5', borderLeft: '4px solid #ff3f6c', color: '#ff1744', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
          >
            Create Account
          </button>
        </form>

        <p style={{ marginTop: '24px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#333', fontWeight: 600, textDecoration: 'underline' }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
