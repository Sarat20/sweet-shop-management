import api from '../api/api'
import { useState } from 'react'

const SweetCard = ({ sweet, reload, isAdmin, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    if (sweet.quantity === 0) return
    
    setLoading(true)
    try {
      await api.post(`/sweets/${sweet._id}/purchase`)
      reload()
    } catch (err) {
      alert(err.response?.data?.message || 'Purchase failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
          <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
            {sweet.category}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-2xl font-bold text-pink-600">₹{sweet.price}</p>
          <p className="text-sm text-gray-600">
            Stock: <span className={`font-semibold ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sweet.quantity}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || loading}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition duration-200 ${
              sweet.quantity === 0 || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700'
            }`}
          >
            {loading ? 'Purchasing...' : 'Purchase'}
          </button>

          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(sweet)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default SweetCard

