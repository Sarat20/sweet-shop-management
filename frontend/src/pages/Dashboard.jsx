import { useEffect, useState } from 'react'
import api from '../api/api'
import SweetCard from '../components/SweetCard'
import AddSweetForm from '../components/AddSweetForm'
import Header from '../components/Header'

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
    <div className="min-h-screen bg-gradient-primary">
      <Header isAdmin={isAdmin} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gradient mb-2">Sweet Shop</h1>
          <p className="text-gray-600 text-lg">Browse our delicious collection</p>
        </div>
        
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Search & Filter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Search by Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Category</label>
              <input
                type="text"
                placeholder="Enter category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Min Price (₹)</label>
              <input
                type="number"
                placeholder="Minimum"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">Max Price (₹)</label>
              <input
                type="number"
                placeholder="Maximum"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="input-field"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSearch}
              className="btn-primary"
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
              >
                {showAddForm ? 'Cancel' : 'Add New Sweet'}
              </button>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="mb-8">
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
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-20 card">
            <p className="text-gray-600 text-xl font-semibold">No sweets found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <div className="card p-6 md:p-8">
      <h3 className="text-2xl font-extrabold text-gradient mb-6">Edit Sweet</h3>
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
            placeholder="Enter category"
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
            className="btn-primary flex-1 disabled:opacity-50"
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
