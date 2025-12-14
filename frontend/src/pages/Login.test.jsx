import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import Login from './Login'
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

describe('Login', () => {
  const mockDecodeToken = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    authUtils.decodeToken = mockDecodeToken
  })

  it('should render login form with email and password fields', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should display admin login title when admin login is clicked', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const adminLoginButton = screen.getByText('Login as Admin')
    await act(async () => {
      fireEvent.click(adminLoginButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Admin Login')).toBeInTheDocument()
    })
    expect(screen.queryByText('Welcome Back')).not.toBeInTheDocument()
  })

  it('should handle successful login and navigate to dashboard', async () => {
    const mockToken = 'mock-jwt-token'
    const mockDecoded = { userId: '1', role: 'user', name: 'Test User' }

    api.post.mockResolvedValueOnce({ data: { token: mockToken } })
    mockDecodeToken.mockReturnValue(mockDecoded)

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
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should clear form fields after successful login', async () => {
    const mockToken = 'mock-jwt-token'
    const mockDecoded = { userId: '1', role: 'user', name: 'Test User' }

    api.post.mockResolvedValueOnce({ data: { token: mockToken } })
    mockDecodeToken.mockReturnValue(mockDecoded)

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
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
    })
  })

  it('should display error message on login failure', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('should prevent admin login for non-admin users', async () => {
    const mockToken = 'mock-jwt-token'
    const mockDecoded = { userId: '1', role: 'user', name: 'Test User' }

    api.post.mockResolvedValueOnce({ data: { token: mockToken } })
    mockDecodeToken.mockReturnValue(mockDecoded)

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    )

    // Click admin login button
    const adminLoginButton = screen.getByText('Login as Admin')
    await act(async () => {
      fireEvent.click(adminLoginButton)
    })

    // Fill form and submit
    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(screen.getByText('You are not authorized to login as admin')).toBeInTheDocument()
    })
  })

  it('should clear form fields after failed login attempt', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' } }
    })

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const emailInput = screen.getByPlaceholderText('Enter your email')
    const passwordInput = screen.getByPlaceholderText('Enter your password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })

    await act(async () => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(submitButton)
    })

    await waitFor(() => {
      expect(emailInput.value).toBe('')
      expect(passwordInput.value).toBe('')
    })
  })

  it('should show admin login button only when not in admin mode', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    expect(screen.getByText('Login as Admin')).toBeInTheDocument()
  })

  it('should hide admin login button when in admin mode', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )

    const adminLoginButton = screen.getByText('Login as Admin')
    await act(async () => {
      fireEvent.click(adminLoginButton)
    })

    await waitFor(() => {
      expect(screen.queryByText('Login as Admin')).not.toBeInTheDocument()
    })
  })
})

