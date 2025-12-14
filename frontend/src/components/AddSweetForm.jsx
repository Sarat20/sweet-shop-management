import { useState } from 'react'
import api from '../api/api'
import '../index.css'

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
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
      <div className="card p-6" style={{ width: '100%', maxWidth: '500px' }}>
        <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fc8019', marginBottom: '24px', textAlign: 'center' }}>Add New Sweet</h3>
        
        {error && (
          <div style={{ background: '#fff5f5', borderLeft: '4px solid #ff3f6c', color: '#ff1744', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px' }}>
            <p style={{ fontWeight: 600 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Sweet Name</label>
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
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Category</label>
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
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Price (₹)</label>
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
            <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>Quantity in Stock</label>
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

          <div style={{ display: 'flex', gap: '12px', flexDirection: window.innerWidth < 640 ? 'column' : 'row' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-success"
              style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
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
    </div>
  )
}

export default AddSweetForm
