'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
	const router = useRouter()
	const [fullName, setFullName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setError(null)
		setLoading(true)

		const supabase = createClient()
		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { full_name: fullName.trim() },
				emailRedirectTo: `${window.location.origin}/dashboard`,
			},
		})

		if (error) {
			setError(error.message)
			setLoading(false)
			return
		}

		router.push(`/verify-email?email=${encodeURIComponent(email)}`)
	}

	return (
		<div className="space-y-8">
			{/* Header */}
			<div className="animate-auth-fade-up space-y-2">
				<h1 className="font-display text-3xl text-foreground">
					Creá tu cuenta
				</h1>
				<p className="text-sm text-muted-foreground">
					Registrate para empezar a chatear con tus documentos.
				</p>
			</div>

			{/* Form */}
			<form
				onSubmit={handleSubmit}
				className="animate-auth-fade-up space-y-5"
				style={{ animationDelay: '100ms' }}
			>
				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="fullName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Nombre y Apellido
						</Label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
							<Input
								id="fullName"
								type="text"
								placeholder="Tu nombre completo"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className="h-11 pl-10 transition-colors focus-visible:border-[#58a6ff]"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Email
						</Label>
						<div className="relative">
							<Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
							<Input
								id="email"
								type="email"
								placeholder="tu@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-11 pl-10 transition-colors focus-visible:border-[#58a6ff]"
								required
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Contraseña
						</Label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
							<Input
								id="password"
								type="password"
								placeholder="Mínimo 6 caracteres"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="h-11 pl-10 transition-colors focus-visible:border-[#58a6ff]"
								required
								minLength={6}
							/>
						</div>
					</div>
				</div>

				{/* Error */}
				{error ? (
					<div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
						<p className="text-sm text-destructive">{error}</p>
					</div>
				) : null}

				{/* Submit */}
				<Button
					type="submit"
					className="h-11 w-full gap-2 bg-[#58a6ff] text-[#0d1117] transition-all hover:bg-[#79b8ff] hover:shadow-[0_0_20px_rgba(88,166,255,0.15)] disabled:opacity-60"
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader2 className="h-4 w-4 animate-spin" />
							Creando cuenta...
						</>
					) : (
						<>
							Crear cuenta
							<ArrowRight className="h-4 w-4" />
						</>
					)}
				</Button>
			</form>

			{/* Footer */}
			<div
				className="animate-auth-fade-up space-y-4"
				style={{ animationDelay: '200ms' }}
			>
				<Separator className="bg-border/60" />
				<p className="text-center text-sm text-muted-foreground">
					¿Ya tenés cuenta?{' '}
					<Link
						href="/login"
						className="font-medium text-[#58a6ff] underline-offset-4 transition-colors hover:text-[#79b8ff] hover:underline"
					>
						Iniciar sesión
					</Link>
				</p>
			</div>
		</div>
	)
}
