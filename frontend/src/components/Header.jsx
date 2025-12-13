import { useNavigate } from 'react-router-dom'

const Header = ({ isAdmin }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient">
            Sweet Shop Management
          </h1>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
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
      </div>
    </header>
  )
}

export default Header
