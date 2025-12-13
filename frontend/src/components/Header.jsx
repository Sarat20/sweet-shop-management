import { useNavigate } from 'react-router-dom'
import '../index.css'

const Header = ({ isAdmin }) => {
  const navigate = useNavigate()

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
          {isAdmin && (
            <span className="admin-badge">
              Admin
            </span>
          )}
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
