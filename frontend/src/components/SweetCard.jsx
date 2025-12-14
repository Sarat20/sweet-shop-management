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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h3 className="sweet-name">{sweet.name}</h3>
        <span className="category-badge">
          {sweet.category}
        </span>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#999' }}>₹</span>
          <p className="price">{sweet.price}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#666' }}>Stock:</span>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: 700, 
            color: sweet.quantity > 0 ? '#60b246' : '#ff3f6c' 
          }}>
            {sweet.quantity}
          </span>
          {sweet.quantity === 0 && (
            <span style={{
              fontSize: '11px',
              background: '#fff5f5',
              color: '#ff1744',
              padding: '4px 8px',
              borderRadius: '12px',
              fontWeight: 600
            }}>
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {!isAdmin && (
          <button
            onClick={handlePurchase}
            disabled={sweet.quantity === 0 || loading}
            className="purchase-btn"
          >
            {loading ? 'Processing...' : 'Purchase Now'}
          </button>
        )}

        {isAdmin && (
          <div style={{ display: 'flex', gap: '8px' }}>
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
