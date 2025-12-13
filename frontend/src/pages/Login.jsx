import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import '../index.css'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="bg-gradient-primary flex items-center justify-center" style={{ minHeight: '100vh', padding: '1rem' }}>
      <div className="card w-full max-w-md p-8" style={{ maxWidth: '28rem' }}>
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gradient mb-3">Welcome Back</h2>
          <p className="text-gray-600 text-lg">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-xl mb-6">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
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
            <label className="block text-gray-700 font-semibold mb-2">Password</label>
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

        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-indigo-600 font-semibold underline" style={{ textDecoration: 'underline' }}>
              Create Account
            </a>
          </p>
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <a 
              href="/login" 
              className="text-indigo-600 font-semibold"
              style={{ fontSize: '0.875rem', display: 'block', textAlign: 'center' }}
            >
              Login as Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
