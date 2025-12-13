import api from '../api/api'
import { useState } from 'react'
import '../index.css'

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
    <div className="sweet-card">
      <div className="flex justify-between items-start mb-4">
        <h3 className="sweet-name">{sweet.name}</h3>
        <span className="category-badge">
          {sweet.category}
        </span>
      </div>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>₹</span>
          <p className="price">{sweet.price}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4b5563' }}>Stock:</span>
          <span style={{ 
            fontSize: '1.125rem', 
            fontWeight: 700, 
            color: sweet.quantity > 0 ? '#16a34a' : '#dc2626' 
          }}>
            {sweet.quantity}
          </span>
          {sweet.quantity === 0 && (
            <span style={{
              fontSize: '0.75rem',
              background: '#fef2f2',
              color: '#b91c1c',
              padding: '0.25rem 0.5rem',
              borderRadius: '9999px',
              fontWeight: 600
            }}>
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handlePurchase}
          disabled={sweet.quantity === 0 || loading}
          className="purchase-btn"
        >
          {loading ? 'Processing...' : 'Purchase Now'}
        </button>

        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(sweet)}
              className="edit-btn"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(sweet._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SweetCard
