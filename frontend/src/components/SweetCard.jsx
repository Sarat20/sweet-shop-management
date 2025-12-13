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
    <div className="card hover:shadow-xl transform hover:scale-105 transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 pr-2">{sweet.name}</h3>
          <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-200 whitespace-nowrap">
            {sweet.category}
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-sm text-gray-500">₹</span>
            <p className="text-3xl font-extrabold text-gradient">
              {sweet.price}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-600">Stock:</span>
            <span className={`text-lg font-bold ${sweet.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {sweet.quantity}
            </span>
            {sweet.quantity === 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || loading}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
              sweet.quantity === 0 || loading
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {loading ? 'Processing...' : 'Purchase Now'}
          </button>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(sweet)}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold py-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(sweet._id)}
                className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-lg hover:shadow-md transform hover:scale-105 transition-all duration-200 font-semibold py-2"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SweetCard
