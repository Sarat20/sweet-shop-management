import React from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthSidebar from '../components/AuthSidebar'
import '../index.css'

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard')
    }
  }, [navigate])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: '#fff'
    }}>
      <AuthSidebar />
      
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: '#fff'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px'
        }}>
          <Link
            to="/login"
            style={{
              display: 'block',
              width: '100%',
              padding: '16px',
              marginBottom: '16px',
              background: '#fc8019',
              color: '#fff',
              textAlign: 'center',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '16px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#e6700a'}
            onMouseLeave={(e) => e.target.style.background = '#fc8019'}
          >
            Login
          </Link>
          
          <Link
            to="/register"
            style={{
              display: 'block',
              width: '100%',
              padding: '16px',
              background: '#fff',
              color: '#333',
              textAlign: 'center',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '16px',
              border: '2px solid #e8e8e8',
              transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#fc8019'}
            onMouseLeave={(e) => e.target.style.borderColor = '#e8e8e8'}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Landing
