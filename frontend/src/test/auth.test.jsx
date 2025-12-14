import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ProtectedRoute from '../components/ProtectedRoute'
import api from '../api/api'
import * as authUtils from '../utils/auth'

vi.mock('../api/api')
vi.mock('../utils/auth')

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Authentication Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should login user and navigate to dashboard', async () => {
    const mockToken = 'test-token'
    const mockDecoded = { userId: '1', role: 'user', name: 'Test User' }
    
    api.post.mockResolvedValueOnce({ data: { token: mockToken } })
    authUtils.decodeToken = vi.fn().mockReturnValue(mockDecoded)

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
    })

    expect(localStorage.getItem('token')).toBe(mockToken)
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
  })

  it('should register user and navigate to login', async () => {
    api.post.mockResolvedValueOnce({ data: { message: 'User registered' } })

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    )

    const nameInput = screen.getByPlaceholderText('Enter your full name')
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Create a password')
    const submitButton = screen.getByRole('button', { name: /create account/i })

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      })
    })

    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should redirect to login when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})

