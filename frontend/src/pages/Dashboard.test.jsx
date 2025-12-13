import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import api from '../api/api'

vi.mock('../api/api')

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should filter sweets by category when category is selected', async () => {
    const mockSweets = [
      { _id: '1', name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 10 },
      { _id: '2', name: 'Chocolate Cake', category: 'Western', price: 200, quantity: 5 }
    ]

    api.get.mockResolvedValueOnce({ data: mockSweets })
    api.get.mockResolvedValueOnce({ data: [mockSweets[0]] })

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })

    const categorySelect = screen.getByLabelText(/category/i)
    fireEvent.change(categorySelect, { target: { value: 'Indian' } })

    const searchButton = screen.getByRole('button', { name: /search/i })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('category=Indian')
      )
    })
  })

  it('should filter sweets by price range', async () => {
    api.get.mockResolvedValue({ data: [] })

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )

    const minPriceInput = screen.getByPlaceholderText(/min price/i)
    const maxPriceInput = screen.getByPlaceholderText(/max price/i)

    fireEvent.change(minPriceInput, { target: { value: '40' } })
    fireEvent.change(maxPriceInput, { target: { value: '100' } })

    const searchButton = screen.getByRole('button', { name: /search/i })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('minPrice=40')
      )
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('maxPrice=100')
      )
    })
  })
})

