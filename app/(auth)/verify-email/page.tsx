'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, ArrowLeft, RefreshCw, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

function VerifyEmailContent() {
	const searchParams = useSearchParams()
	const email = searchParams.get('email') ?? ''

	const [resent, setResent] = useState(false)
	const [loading, setLoading] = useState(false)
	const [cooldown, setCooldown] = useState(0)

	useEffect(() => {
		if (cooldown <= 0) return
		const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
		return () => clearTimeout(t)
	}, [cooldown])

	async function handleResend() {
		if (!email || cooldown > 0) return
		setLoading(true)
		const supabase = createClient()
		await supabase.auth.resend({
			type: 'signup',
			email,
			options: { emailRedirectTo: `${window.location.origin}/dashboard` },
		})
		setLoading(false)
		setResent(true)
		setCooldown(60)
	}

	return (
		<div className="space-y-8">
			{/* Icon */}
			<div className="animate-auth-fade-up flex justify-center">
				<div className="relative flex h-16 w-16 items-center justify-center">
					<div className="animate-slow-ping absolute inset-0 rounded-full bg-[#58a6ff]/15" />
					<div className="absolute -inset-2 rounded-full bg-[#58a6ff]/5 animate-pulse" />
					<div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#58a6ff]/25 bg-[#58a6ff]/10">
						<Mail className="h-7 w-7 text-[#58a6ff]" />
					</div>
				</div>
			</div>

			{/* Header */}
			<div
				className="animate-auth-fade-up space-y-2"
				style={{ animationDelay: '80ms' }}
			>
				<h1 className="font-display text-3xl text-foreground">
					Revisá tu email
				</h1>
				<p className="text-sm leading-relaxed text-muted-foreground">
					Te enviamos un enlace de confirmación. Hacé clic en él para activar tu cuenta.
				</p>
			</div>

			{/* Email pill */}
			{email && (
				<div
					className="animate-auth-fade-up"
					style={{ animationDelay: '160ms' }}
				>
					<div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3">
						<Mail className="h-4 w-4 shrink-0 text-muted-foreground/50" />
						<span className="truncate text-sm font-medium text-foreground">
							{email}
						</span>
					</div>
				</div>
			)}

			{/* Steps */}
			<div
				className="animate-auth-fade-up space-y-3"
				style={{ animationDelay: '240ms' }}
			>
				{[
					{ n: '01', text: 'Abrí tu casilla de correo' },
					{ n: '02', text: 'Buscá un mail de PDFact' },
					{ n: '03', text: 'Hacé clic en "Confirmar email"' },
				].map(({ n, text }) => (
					<div key={n} className="flex items-center gap-3">
						<span className="font-mono text-xs tabular-nums text-[#58a6ff]/40">
							{n}
						</span>
						<span className="text-sm text-muted-foreground">{text}</span>
					</div>
				))}
			</div>

			{/* Resend */}
			<div
				className="animate-auth-fade-up space-y-3"
				style={{ animationDelay: '320ms' }}
			>
				{resent && (
					<div className="flex items-center gap-2.5 rounded-lg border border-[#3fb950]/20 bg-[#3fb950]/5 px-4 py-3">
						<CheckCircle2 className="h-4 w-4 shrink-0 text-[#3fb950]" />
						<p className="text-sm text-[#3fb950]">Email reenviado correctamente.</p>
					</div>
				)}
				<Button
					variant="outline"
					className="h-11 w-full gap-2 border-border/80 text-muted-foreground transition-colors hover:border-[#58a6ff]/40 hover:text-[#58a6ff] disabled:opacity-50"
					onClick={handleResend}
					disabled={loading || cooldown > 0 || !email}
				>
					<RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
					{cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar email'}
				</Button>
			</div>

			{/* Back to login */}
			<div
				className="animate-auth-fade-up"
				style={{ animationDelay: '400ms' }}
			>
				<Link
					href="/login"
					className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					Volver al inicio de sesión
				</Link>
			</div>
		</div>
	)
}

export default function VerifyEmailPage() {
	return (
		<Suspense>
			<VerifyEmailContent />
		</Suspense>
	)
}
