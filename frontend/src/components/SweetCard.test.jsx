import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SweetCard from './SweetCard'
import api from '../api/api'

vi.mock('../api/api')

describe('SweetCard', () => {
  const mockSweet = {
    _id: '1',
    name: 'Gulab Jamun',
    category: 'Indian',
    price: 50,
    quantity: 10
  }

  const mockReload = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'test-token')
    window.alert = vi.fn()
  })

  it('should render sweet information correctly', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Gulab Jamun')).toBeInTheDocument()
    expect(screen.getByText('Indian')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('should show purchase button for regular users', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByRole('button', { name: /purchase now/i })).toBeInTheDocument()
  })

  it('should hide purchase button for admin users', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.queryByRole('button', { name: /purchase now/i })).not.toBeInTheDocument()
  })

  it('should show edit and delete buttons for admin users', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should handle successful purchase', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'Purchase successful' } })

    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const purchaseButton = screen.getByRole('button', { name: /purchase now/i })
    
    await act(async () => {
      fireEvent.click(purchaseButton)
    })

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/sweets/1/purchase')
    })

    await waitFor(() => {
      expect(mockReload).toHaveBeenCalled()
    })
  })

  it('should disable purchase button when quantity is zero', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 }

    render(
      <SweetCard
        sweet={outOfStockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const purchaseButton = screen.getByRole('button', { name: /purchase now/i })
    expect(purchaseButton).toBeDisabled()
  })

  it('should not call purchase API when quantity is zero', async () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 }

    render(
      <SweetCard
        sweet={outOfStockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const purchaseButton = screen.getByRole('button', { name: /purchase now/i })
    
    await act(async () => {
      fireEvent.click(purchaseButton)
    })

    expect(api.post).not.toHaveBeenCalled()
  })

  it('should display out of stock badge when quantity is zero', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 }

    render(
      <SweetCard
        sweet={outOfStockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('should show loading state during purchase', async () => {
    api.post.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100)))

    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const purchaseButton = screen.getByRole('button', { name: /purchase now/i })
    
    await act(async () => {
      fireEvent.click(purchaseButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument()
    })
  })

  it('should handle purchase failure and show alert', async () => {
    const errorMessage = 'Purchase failed'
    api.post.mockRejectedValueOnce({
      response: { data: { message: errorMessage } }
    })

    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const purchaseButton = screen.getByRole('button', { name: /purchase now/i })
    
    await act(async () => {
      fireEvent.click(purchaseButton)
    })

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage)
    })
  })

  it('should call onEdit when update button is clicked', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const updateButton = screen.getByRole('button', { name: /update/i })
    fireEvent.click(updateButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockSweet)
  })

  it('should call onDelete when delete button is clicked', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete/i })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  it('should display stock quantity with correct color when in stock', () => {
    render(
      <SweetCard
        sweet={mockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const stockElement = screen.getByText('10')
    expect(stockElement).toHaveStyle({ color: 'rgb(96, 178, 70)' })
  })

  it('should display stock quantity with correct color when out of stock', () => {
    const outOfStockSweet = { ...mockSweet, quantity: 0 }

    render(
      <SweetCard
        sweet={outOfStockSweet}
        reload={mockReload}
        isAdmin={false}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    )

    const stockElement = screen.getByText('0')
    expect(stockElement).toHaveStyle({ color: 'rgb(255, 63, 108)' })
  })
})

