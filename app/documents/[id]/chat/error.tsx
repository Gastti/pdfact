'use client'

import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
	error: Error & { digest?: string }
	reset: () => void
}

export default function ChatError({ error, reset }: Props) {
	return (
		<div className="flex h-full flex-col items-center justify-center px-6">
			<div className="max-w-sm text-center">
				<div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
					<AlertCircle className="h-6 w-6 text-destructive" />
				</div>
				<h2 className="font-display text-xl text-foreground">Algo salió mal</h2>
				<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
					{error.message || 'Ocurrió un error al cargar el chat.'}
				</p>
				<div className="mt-6 flex items-center justify-center gap-3">
					<Button
						onClick={reset}
						className="bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff]"
					>
						Reintentar
					</Button>
					<Button variant="outline" asChild>
						<Link href="/new">Volver al dashboard</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
