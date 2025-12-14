import React from 'react'
import { useNavigate } from 'react-router-dom'
import { isAdmin, getUserName } from '../utils/auth'
import '../index.css'

const Header = () => {
  const navigate = useNavigate()
  const admin = isAdmin()
  const userName = getUserName()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          Sweet Shop Management
        </h1>
        <div className="flex items-center gap-4">
          {admin ? (
            <span className="admin-badge">
              Admin
            </span>
          ) : userName ? (
            <span style={{
              background: '#f0f0f0',
              color: '#333',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {userName}
            </span>
          ) : null}
          <button
            onClick={handleLogout}
            className="btn-danger"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
