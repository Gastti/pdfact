import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import LoginPage from '@/app/(auth)/login/page'

// Mock de next/navigation
const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

// Mock del cliente de Supabase
const mockSignIn = vi.fn()
vi.mock('@/lib/supabase/client', () => ({
	createClient: () => ({
		auth: {
			signInWithPassword: mockSignIn,
		},
	}),
}))

describe('LoginPage', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renderiza el formulario de login', () => {
		render(<LoginPage />)
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Ingresar' })).toBeInTheDocument()
	})

	it('muestra link a registro', () => {
		render(<LoginPage />)
		expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/register')
	})

	it('redirige a /new en login exitoso', async () => {
		mockSignIn.mockResolvedValue({ error: null })
		const user = userEvent.setup()
		render(<LoginPage />)

		await user.type(screen.getByLabelText('Email'), 'test@test.com')
		await user.type(screen.getByLabelText('Contraseña'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Ingresar' }))

		expect(mockPush).toHaveBeenCalledWith('/new')
	})

	it('muestra error si el login falla', async () => {
		mockSignIn.mockResolvedValue({ error: { message: 'Invalid login credentials' } })
		const user = userEvent.setup()
		render(<LoginPage />)

		await user.type(screen.getByLabelText('Email'), 'test@test.com')
		await user.type(screen.getByLabelText('Contraseña'), 'wrong')
		await user.click(screen.getByRole('button', { name: 'Ingresar' }))

		expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
		expect(mockPush).not.toHaveBeenCalled()
	})
})
