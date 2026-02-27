import { after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/gemini/embeddings'
import { streamChatResponse } from '@/lib/gemini/chat'
import type { MatchChunksResult } from '@/lib/supabase/types'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: { conversationId: string; message: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Request inválido' }, { status: 400 })
  }

  const { conversationId, message } = body
  if (!conversationId || !message?.trim()) {
    return Response.json({ error: 'conversationId y message son requeridos' }, { status: 400 })
  }

  // Verificar que la conversación pertenece al usuario
  const { data: conversation, error: convError } = await supabase
    .from('conversations')
    .select('id, document_id')
    .eq('id', conversationId)
    .eq('user_id', user.id)
    .single()

  if (convError || !conversation) {
    return Response.json({ error: 'Conversación no encontrada' }, { status: 403 })
  }

  // Guardar mensaje del usuario
  await supabase.from('messages').insert({
    conversation_id: conversationId,
    role: 'user',
    content: message.trim(),
  })

  // Generar embedding de la pregunta y buscar chunks relevantes
  let chunks: MatchChunksResult[] = []
  try {
    const embedding = await generateEmbedding(message)
    const embeddingStr = `[${embedding.join(',')}]`
    const { data } = await supabase.rpc('match_chunks', {
      query_embedding: embeddingStr as unknown as number[],
      target_document_id: conversation.document_id,
      match_count: 5,
    })
    chunks = (data as MatchChunksResult[]) ?? []
  } catch (err) {
    console.error('[POST /api/chat] Embedding/match error:', err)
    // Continuar sin contexto si falla — el modelo lo indicará
  }

  const sources = chunks.map((c) => ({
    id: c.id,
    content: c.content.slice(0, 300),
    chunk_index: c.chunk_index,
  }))

  // Construir stream de respuesta
  let fullResponse = ''

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const generator = streamChatResponse(message, chunks)
        for await (const text of generator) {
          fullResponse += text
          controller.enqueue(new TextEncoder().encode(text))
        }
      } catch (err) {
        console.error('[POST /api/chat] Stream error:', err)
        const errorMsg = 'Lo siento, hubo un error al generar la respuesta.'
        controller.enqueue(new TextEncoder().encode(errorMsg))
        fullResponse = errorMsg
      } finally {
        controller.close()
      }
    },
  })

  // Guardar respuesta del asistente después de que el stream termine (no bloquea)
  after(async () => {
    if (fullResponse) {
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: fullResponse,
      })
    }
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Sources': encodeURIComponent(JSON.stringify(sources)),
    },
  })
}
