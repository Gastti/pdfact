import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChatSidebar } from '@/components/layout/ChatSidebar'

export default async function NewChatLayout({ children }: { children: React.ReactNode }) {
	const supabase = await createClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/login')
	}

	const { data: conversations } = await supabase
		.from('conversations')
		.select('document_id, created_at, documents(name)')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false })

	const chats = (conversations ?? []).map((c) => ({
		documentId: c.document_id,
		documentName: (c.documents as unknown as { name: string })?.name ?? 'Documento',
		createdAt: c.created_at,
	}))

	const userInfo = {
		email: user.email ?? null,
		name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
	}

	return (
		<div className="flex h-[100dvh]">
			<ChatSidebar chats={chats} user={userInfo} />
			<main className="min-w-0 flex-1 overflow-hidden">{children}</main>
		</div>
	)
}
