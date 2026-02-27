import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import RegisterPage from '@/app/(auth)/register/page'

const mockPush = vi.fn()
const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
	useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

const mockSignUp = vi.fn()
vi.mock('@/lib/supabase/client', () => ({
	createClient: () => ({
		auth: {
			signUp: mockSignUp,
		},
	}),
}))

describe('RegisterPage', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('renderiza el formulario de registro', () => {
		render(<RegisterPage />)
		expect(screen.getByLabelText('Nombre y Apellido')).toBeInTheDocument()
		expect(screen.getByLabelText('Email')).toBeInTheDocument()
		expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
		expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeInTheDocument()
	})

	it('muestra link a login', () => {
		render(<RegisterPage />)
		expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
	})

	it('redirige a /new en registro exitoso', async () => {
		mockSignUp.mockResolvedValue({ error: null })
		const user = userEvent.setup()
		render(<RegisterPage />)

		await user.type(screen.getByLabelText('Nombre y Apellido'), 'Juan Pérez')
		await user.type(screen.getByLabelText('Email'), 'nuevo@test.com')
		await user.type(screen.getByLabelText('Contraseña'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

		expect(mockSignUp).toHaveBeenCalledWith({
			email: 'nuevo@test.com',
			password: 'password123',
			options: { data: { full_name: 'Juan Pérez' } },
		})
		expect(mockPush).toHaveBeenCalledWith('/new')
	})

	it('muestra error si el registro falla', async () => {
		mockSignUp.mockResolvedValue({ error: { message: 'User already registered' } })
		const user = userEvent.setup()
		render(<RegisterPage />)

		await user.type(screen.getByLabelText('Nombre y Apellido'), 'Juan Pérez')
		await user.type(screen.getByLabelText('Email'), 'existente@test.com')
		await user.type(screen.getByLabelText('Contraseña'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

		expect(await screen.findByText('User already registered')).toBeInTheDocument()
		expect(mockPush).not.toHaveBeenCalled()
	})
})
