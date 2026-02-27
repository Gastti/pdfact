'use client'

import { useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle2, AlertCircle, Loader2, FileUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type UploadState = 'idle' | 'loading' | 'done' | 'error'

export function UploadArea() {
	const router = useRouter()
	const inputRef = useRef<HTMLInputElement>(null)
	const [state, setState] = useState<UploadState>('idle')
	const [error, setError] = useState<string | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleFile = useCallback(
		async (file: File) => {
			if (file.type !== 'application/pdf') {
				setError('Solo se aceptan archivos PDF.')
				setState('error')
				return
			}
			if (file.size > 10 * 1024 * 1024) {
				setError('El archivo supera el límite de 10 MB.')
				setState('error')
				return
			}

			setState('loading')
			setError(null)

			let res: Response
			let json: unknown
			try {
				const formData = new FormData()
				formData.append('file', file)
				res = await fetch('/api/documents', { method: 'POST', body: formData })
				json = await res.json()
			} catch (err) {
				console.error('[UploadArea] fetch falló:', err)
				setError('No se pudo conectar con el servidor.')
				setState('error')
				return
			}

			if (!res.ok) {
				console.error('[UploadArea] error del servidor:', json)
				setError((json as { error?: string }).error ?? 'Error inesperado.')
				setState('error')
				return
			}

			setState('done')
			const doc = json as { id: string }
			router.push(`/documents/${doc.id}/chat`)
		},
		[router]
	)

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			const file = e.dataTransfer.files[0]
			if (file) handleFile(file)
		},
		[handleFile]
	)

	function reset() {
		setState('idle')
		setError(null)
		if (inputRef.current) inputRef.current.value = ''
	}

	return (
		<div
			className={cn(
				'group relative overflow-hidden rounded-xl border border-dashed transition-all duration-200',
				state === 'idle' && !isDragging && 'border-border/80 hover:border-[#58a6ff]/40',
				isDragging && 'border-[#58a6ff]/60 bg-[#58a6ff]/5',
				state === 'done' && 'border-[#3fb950]/40 bg-[#3fb950]/5',
				state === 'error' && 'border-destructive/40 bg-destructive/5',
				state === 'loading' && 'border-border/60'
			)}
			onDragOver={(e) => {
				e.preventDefault()
				setIsDragging(true)
			}}
			onDragLeave={() => setIsDragging(false)}
			onDrop={handleDrop}
		>
			<div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-7">
				{state === 'idle' && (
					<>
						<div
							className={cn(
								'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200',
								isDragging
									? 'border-[#58a6ff]/40 bg-[#58a6ff]/10 text-[#58a6ff]'
									: 'border-border bg-secondary/50 text-muted-foreground group-hover:border-[#58a6ff]/30 group-hover:text-[#58a6ff]'
							)}
						>
							<FileUp className="h-5 w-5" />
						</div>
						<div className="min-w-0 sm:flex-1">
							<p className="text-sm font-medium text-foreground">
								Arrastrá un PDF o hacé clic para seleccionar
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Solo PDF · Máx. 10 MB
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							className="justify-center gap-1.5 border-border/80 transition-colors hover:border-[#58a6ff]/40 hover:text-[#58a6ff] sm:shrink-0"
							onClick={() => inputRef.current?.click()}
						>
							<Upload className="h-3.5 w-3.5" />
							Seleccionar
						</Button>
						<input
							ref={inputRef}
							type="file"
							accept="application/pdf"
							className="hidden"
							onChange={(e) => {
								const file = e.target.files?.[0]
								if (file) handleFile(file)
							}}
						/>
					</>
				)}

				{state === 'loading' && (
					<>
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary/50">
							<Loader2 className="h-5 w-5 animate-spin text-[#58a6ff]" />
						</div>
						<div className="min-w-0 sm:flex-1">
							<p className="text-sm font-medium text-foreground">
								Procesando documento…
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Esto puede tardar unos segundos.
							</p>
						</div>
					</>
				)}

				{state === 'done' && (
					<>
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/10">
							<CheckCircle2 className="h-5 w-5 text-[#3fb950]" />
						</div>
						<div className="min-w-0 sm:flex-1">
							<p className="text-sm font-medium text-foreground">
								¡Documento procesado!
							</p>
							<p className="mt-0.5 text-xs text-muted-foreground">
								Ya podés chatear con él.
							</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="justify-center text-xs text-muted-foreground sm:shrink-0"
							onClick={reset}
						>
							Subir otro
						</Button>
					</>
				)}

				{state === 'error' && (
					<>
						<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10">
							<AlertCircle className="h-5 w-5 text-destructive" />
						</div>
						<div className="min-w-0 sm:flex-1">
							<p className="text-sm font-medium text-destructive">{error}</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="justify-center text-xs text-muted-foreground sm:shrink-0"
							onClick={reset}
						>
							Reintentar
						</Button>
					</>
				)}
			</div>
		</div>
	)
}
