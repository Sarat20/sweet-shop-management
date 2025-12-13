import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AddSweetForm from './AddSweetForm'
import api from '../api/api'

vi.mock('../api/api')

describe('AddSweetForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.setItem('token', 'test-token')
  })

  it('should submit form and call API with correct data', async () => {
    api.post.mockResolvedValueOnce({ data: { _id: '1', name: 'Gulab Jamun', category: 'Indian', price: 50, quantity: 10 } })

    const onSuccess = vi.fn()

    render(
      <BrowserRouter>
        <AddSweetForm onSuccess={onSuccess} />
      </BrowserRouter>
    )

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Gulab Jamun' } })
    fireEvent.change(screen.getByPlaceholderText(/category/i), { target: { value: 'Indian' } })
    fireEvent.change(screen.getByPlaceholderText(/price/i), { target: { value: '50' } })
    fireEvent.change(screen.getByPlaceholderText(/quantity/i), { target: { value: '10' } })

    fireEvent.click(screen.getByRole('button', { name: /add/i }))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/sweets', {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50,
        quantity: 10
      }, expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringContaining('test-token')
        })
      }))
    })
  })
})

