import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    Navigate: ({ to }) => <div data-testid="navigate">Navigate to {to}</div>
  }
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should redirect to login when user is not authenticated', () => {
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByTestId('navigate')).toBeInTheDocument()
    expect(screen.getByText(/navigate to/i)).toHaveTextContent('login')
  })

  it('should render children when user is authenticated', () => {
    localStorage.setItem('token', 'valid-token')

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})

