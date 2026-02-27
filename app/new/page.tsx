import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { UploadArea } from '@/components/documents/UploadArea'
import { FileUp } from 'lucide-react'

export default async function NewChatPage() {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/login')
	}

	return (
		<div className="flex h-full flex-col items-center justify-center px-4 sm:px-6">
			<div className="w-full max-w-md">
				<div className="animate-auth-fade-up text-center">
					<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card">
						<FileUp className="h-7 w-7 text-[#58a6ff]" />
					</div>
					<h1 className="font-display text-2xl text-foreground">Nuevo chat</h1>
					<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
						Subí un PDF para empezar a hacerle preguntas con IA.
					</p>
				</div>

				<div
					className="animate-auth-fade-up mt-8"
					style={{ animationDelay: '100ms' }}
				>
					<UploadArea />
				</div>
			</div>
		</div>
	)
}
