import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'
import api from '../api/api'

vi.mock('../api/api')

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'test-token')
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

    const categoryInput = screen.getByPlaceholderText('Enter category')
    await act(async () => {
      fireEvent.change(categoryInput, { target: { value: 'Indian' } })
    })

    const searchButton = screen.getByRole('button', { name: /search sweets/i })
    await act(async () => {
      fireEvent.click(searchButton)
    })

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

    await waitFor(() => {
      expect(api.get).toHaveBeenCalled()
    })

    const minPriceInput = screen.getByPlaceholderText('Minimum')
    const maxPriceInput = screen.getByPlaceholderText('Maximum')

    await act(async () => {
      fireEvent.change(minPriceInput, { target: { value: '40' } })
      fireEvent.change(maxPriceInput, { target: { value: '100' } })
    })

    const searchButton = screen.getByRole('button', { name: /search sweets/i })
    await act(async () => {
      fireEvent.click(searchButton)
    })

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

