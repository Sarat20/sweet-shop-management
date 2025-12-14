import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../api/api'
import { decodeToken } from '../utils/auth'
import '../index.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAdminLogin, setIsAdminLogin] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const adminParam = searchParams.get('admin')
    if (adminParam === 'true') {
      setIsAdminLogin(true)
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/auth/login', { email, password })
      const decoded = decodeToken(res.data.token)
      
      if (isAdminLogin && decoded.role !== 'admin') {
        setError('You are not authorized to login as admin')
        return
      }
      
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleAdminLogin = () => {
    setIsAdminLogin(true)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: '#fff' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#fc8019', marginBottom: '8px' }}>
            {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
          </h2>
          <p style={{ color: '#666', fontSize: '16px' }}>Sign in to your account</p>
        </div>
        
        {error && (
          <div style={{ background: '#fff5f5', borderLeft: '4px solid #ff3f6c', color: '#ff1744', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              placeholder="Enter your password"
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
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Don't have an account?{' '}
              <a href="/register" style={{ color: '#fc8019', fontWeight: 600, textDecoration: 'underline' }}>
                Create Account
              </a>
            </p>
          </div>
          {!isAdminLogin && (
            <div style={{ borderTop: '1px solid #e8e8e8', paddingTop: '16px' }}>
              <button
                onClick={handleAdminLogin}
                style={{ color: '#fc8019', fontWeight: 600, fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Login as Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
