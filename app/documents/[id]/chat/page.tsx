import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { ChatWindow } from '@/components/chat/ChatWindow'
import type { Message } from '@/lib/supabase/types'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ChatPage({ params }: Props) {
  const { id: documentId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verificar que el documento pertenece al usuario
  const { data: document } = await supabase
    .from('documents')
    .select('id, name')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (!document) {
    notFound()
  }

  // Upsert conversation — UNIQUE(document_id, user_id) garantiza una por par
  const { data: conversation } = await supabase
    .from('conversations')
    .upsert(
      { document_id: documentId, user_id: user.id },
      { onConflict: 'document_id,user_id', ignoreDuplicates: false },
    )
    .select('id')
    .single()

  if (!conversation) {
    notFound()
  }

  // Fetch mensajes previos
  const { data: messages } = await supabase
    .from('messages')
    .select()
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true })

  return (
    <ChatWindow
      conversationId={conversation.id}
      documentName={document.name}
      initialMessages={(messages ?? []) as Message[]}
    />
  )
}
