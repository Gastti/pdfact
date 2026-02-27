import { FileText } from 'lucide-react'
import { DocumentCard } from './DocumentCard'
import type { Document } from '@/lib/supabase/types'

type Props = {
	documents: Document[]
}

export function DocumentList({ documents }: Props) {
	if (documents.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 py-20 text-center">
				<div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary/60">
					<FileText className="h-6 w-6 text-muted-foreground/60" />
				</div>
				<h3 className="mt-5 text-sm font-medium text-foreground">Sin documentos</h3>
				<p className="mt-1.5 max-w-[260px] text-sm leading-relaxed text-muted-foreground">
					Subí un PDF arriba para empezar a hacerle preguntas.
				</p>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{documents.map((doc) => (
				<DocumentCard key={doc.id} document={doc} />
			))}
		</div>
	)
}
