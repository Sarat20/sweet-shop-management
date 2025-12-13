import { useNavigate } from 'react-router-dom'

const Header = ({ isAdmin }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Sweet Shop Management
          </h1>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                Admin
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 font-semibold"
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

