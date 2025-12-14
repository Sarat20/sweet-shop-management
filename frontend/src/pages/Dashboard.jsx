import { useEffect, useState } from 'react'
import api from '../api/api'
import SweetCard from '../components/SweetCard'
import AddSweetForm from '../components/AddSweetForm'
import Header from '../components/Header'
import '../index.css'

const Dashboard = () => {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  })
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingSweet, setEditingSweet] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    checkAdminStatus()
    loadSweets()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await api.get('/sweets')
        setIsAdmin(true)
      }
    } catch (err) {
      setIsAdmin(false)
    }
  }

  const loadSweets = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.name) params.append('name', filters.name)
      if (filters.category) params.append('category', filters.category)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)

      const url = params.toString() ? `/sweets/search?${params}` : '/sweets'
      const res = await api.get(url)
      setSweets(res.data)
    } catch (err) {
      console.error('Failed to load sweets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadSweets()
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sweet?')) return

    try {
      await api.delete(`/sweets/${id}`)
      loadSweets()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete')
    }
  }

  const handleEdit = (sweet) => {
    setEditingSweet(sweet)
    setShowAddForm(true)
  }

  const handleUpdate = async (formData) => {
    try {
      await api.put(`/sweets/${editingSweet._id}`, formData)
      setEditingSweet(null)
      setShowAddForm(false)
      loadSweets()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <Header isAdmin={isAdmin} />
      
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fc8019', marginBottom: '8px' }}>Sweet Shop</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>Browse our delicious collection</p>
        </div>
        
        <div className="card p-6 mb-8">
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#333', marginBottom: '20px' }}>Search & Filter</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>Search by Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>Category</label>
              <input
                type="text"
                placeholder="Enter category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>Min Price (₹)</label>
              <input
                type="number"
                placeholder="Minimum"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#333', fontWeight: 600, marginBottom: '8px', fontSize: '13px' }}>Max Price (₹)</label>
              <input
                type="number"
                placeholder="Maximum"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px', flexDirection: window.innerWidth < 640 ? 'column' : 'row' }}>
            <button
              onClick={handleSearch}
              className="btn-primary"
              style={{ width: window.innerWidth < 640 ? '100%' : 'auto' }}
            >
              Search Sweets
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setEditingSweet(null)
                  setShowAddForm(!showAddForm)
                }}
                className="btn-success"
                style={{ width: window.innerWidth < 640 ? '100%' : 'auto' }}
              >
                {showAddForm ? 'Cancel' : 'Add New Sweet'}
              </button>
            )}
          </div>
        </div>

        {showAddForm && (
          <div style={{ marginBottom: '32px' }}>
            {editingSweet ? (
              <EditSweetForm
                sweet={editingSweet}
                onUpdate={handleUpdate}
                onCancel={() => {
                  setEditingSweet(null)
                  setShowAddForm(false)
                }}
              />
            ) : (
              <AddSweetForm
                onSuccess={() => {
                  setShowAddForm(false)
                  loadSweets()
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '16px', color: '#666', fontSize: '16px' }}>Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '80px', paddingBottom: '80px' }} className="card">
            <p style={{ color: '#666', fontSize: '20px', fontWeight: 600 }}>No sweets found</p>
            <p style={{ color: '#999', marginTop: '8px' }}>Try adjusting your search filters</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet._id}
                sweet={sweet}
                reload={loadSweets}
                isAdmin={isAdmin}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const EditSweetForm = ({ sweet, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    name: sweet.name,
    category: sweet.category,
    price: sweet.price,
    quantity: sweet.quantity
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onUpdate({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#fc8019', marginBottom: '24px' }}>Edit Sweet</h3>
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
            placeholder="Enter category"
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
            className="btn-primary"
            style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Updating...' : 'Update Sweet'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Dashboard
