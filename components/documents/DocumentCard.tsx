'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileText, MessageSquare, Trash2, Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import type { Document } from '@/lib/supabase/types'

type Props = {
	document: Document
}

function formatDate(isoString: string): string {
	return new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' }).format(new Date(isoString))
}

export function DocumentCard({ document }: Props) {
	const router = useRouter()
	const [deleting, setDeleting] = useState(false)

	async function handleDelete() {
		if (!window.confirm(`¿Eliminar "${document.name}"? Esta acción no se puede deshacer.`)) {
			return
		}

		setDeleting(true)
		try {
			const res = await fetch('/api/documents', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ documentId: document.id }),
			})

			if (!res.ok) {
				const data = await res.json()
				throw new Error(data.error ?? 'Error al eliminar')
			}

			router.refresh()
		} catch (err) {
			alert(err instanceof Error ? err.message : 'Error al eliminar el documento')
			setDeleting(false)
		}
	}

	return (
		<div className="group relative rounded-xl border border-border/80 bg-card transition-all duration-200 hover:border-border hover:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
			<Link
				href={`/documents/${document.id}/chat`}
				className="block px-5 py-4"
			>
				<div className="flex items-start gap-3.5">
					<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#58a6ff]/8 text-[#58a6ff]">
						<FileText className="h-4.5 w-4.5" />
					</div>
					<div className="min-w-0 flex-1">
						<p className="truncate text-sm font-medium leading-snug text-foreground">
							{document.name}
						</p>
						<p className="mt-1 text-xs text-muted-foreground">
							{formatDate(document.created_at)}
						</p>
					</div>
				</div>
			</Link>

			{/* Actions — visible on hover */}
			<div className="absolute right-3 top-3 flex gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
				<TooltipProvider delayDuration={300}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href={`/documents/${document.id}/chat`}
								className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[#58a6ff]/10 hover:text-[#58a6ff]"
							>
								<MessageSquare className="h-3.5 w-3.5" />
							</Link>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Chatear</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<button
								onClick={handleDelete}
								disabled={deleting}
								className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
							>
								{deleting ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									<Trash2 className="h-3.5 w-3.5" />
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent side="bottom">
							<p>Eliminar</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	)
}
