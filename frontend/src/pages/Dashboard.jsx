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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Header isAdmin={isAdmin} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Sweet Shop</h1>
          
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input
                type="text"
                placeholder="Search by name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <input
                type="text"
                placeholder="Category"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition duration-200"
              >
                Search
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingSweet(null)
                    setShowAddForm(!showAddForm)
                  }}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition duration-200"
                >
                  {showAddForm ? 'Cancel' : 'Add Sweet'}
                </button>
              )}
            </div>
          </div>

          {showAddForm && (
            <div className="mb-6">
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
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No sweets found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Edit Sweet</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          min="0"
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
          min="0"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default Dashboard

