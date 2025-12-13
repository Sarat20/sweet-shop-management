import { useState } from 'react'
import api from '../api/api'

const AddSweetForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post('/sweets', {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      })
      onSuccess()
      setFormData({ name: '', category: '', price: '', quantity: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add sweet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-extrabold text-gradient mb-6">Add New Sweet</h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded mb-6">
          <p className="font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Sweet Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter sweet name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            placeholder="e.g., Indian, Western, Bakery"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Price (₹)</label>
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            className="input-field"
            required
            min="0"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Quantity in Stock</label>
          <input
            type="number"
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="input-field"
            required
            min="0"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-success flex-1 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Sweet'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default AddSweetForm
