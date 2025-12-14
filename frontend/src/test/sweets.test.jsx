import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SweetCard from '../components/SweetCard'
import AddSweetForm from '../components/AddSweetForm'
import Dashboard from '../pages/Dashboard'
import api from '../api/api'

vi.mock('../api/api')

describe('Sweets Management Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'test-token')
    window.alert = vi.fn()
  })

  it('should purchase sweet and reload list', async () => {
    const mockSweet = {
      _id: '1',
      name: 'Gulab Jamun',
      category: 'Indian',
      price: 50,
      quantity: 10
    }
    const mockReload = vi.fn()

    api.post.mockResolvedValueOnce({ data: { message: 'Purchase successful' } })

    render(
      <BrowserRouter>
        <SweetCard
          sweet={mockSweet}
          reload={mockReload}
          isAdmin={false}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
        />
      </BrowserRouter>
    )

    const purchaseButton = screen.getByRole('button', { name: /purchase now/i })
    
    await act(async () => {
      fireEvent.click(purchaseButton)
    })

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/sweets/1/purchase')
    })

    expect(mockReload).toHaveBeenCalled()
  })

  it('should add new sweet when admin submits form', async () => {
    const mockOnSuccess = vi.fn()
    
    api.post.mockResolvedValueOnce({ 
      data: { _id: '1', name: 'Rasgulla', category: 'Indian', price: 40, quantity: 20 } 
    })

    render(
      <BrowserRouter>
        <AddSweetForm onSuccess={mockOnSuccess} />
      </BrowserRouter>
    )

    const nameInput = screen.getByPlaceholderText('Enter sweet name')
    const categoryInput = screen.getByPlaceholderText(/e\.g\./i)
    const priceInput = screen.getByPlaceholderText('Enter price')
    const quantityInput = screen.getByPlaceholderText('Enter quantity')
    const submitButton = screen.getByRole('button', { name: /add sweet/i })

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Rasgulla' } })
      fireEvent.change(categoryInput, { target: { value: 'Indian' } })
      fireEvent.change(priceInput, { target: { value: '40' } })
      fireEvent.change(quantityInput, { target: { value: '20' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/sweets', {
        name: 'Rasgulla',
        category: 'Indian',
        price: 40,
        quantity: 20
      })
    })

    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it('should display sweets list on dashboard', async () => {
    const mockSweets = [
      { _id: '1', name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 10 },
      { _id: '2', name: 'Chocolate Cake', category: 'Western', price: 200, quantity: 5 }
    ]

    api.get.mockResolvedValueOnce({ data: mockSweets })

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Gulab Jamun')).toBeInTheDocument()
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument()
    })
  })
})

