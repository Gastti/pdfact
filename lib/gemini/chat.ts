import Groq from 'groq-sdk'
import type { MatchChunksResult } from '@/lib/supabase/types'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

const SYSTEM_PROMPT = `Sos un asistente que responde preguntas sobre documentos PDF. \
Citá las fuentes como [1], [2], etc. refiriéndote a los fragmentos del documento que se te proporcionan. \
Si el contexto no es suficiente para responder, decilo claramente.`

export async function* streamChatResponse(
  question: string,
  contextChunks: MatchChunksResult[],
): AsyncGenerator<string> {
  const contextText = contextChunks
    .map((chunk, i) => `[${i + 1}] (fragmento ${chunk.chunk_index}):\n${chunk.content}`)
    .join('\n\n')

  const stream = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    stream: true,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Contexto del documento:\n${contextText}\n\nPregunta: ${question}`,
      },
    ],
  })

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content
    if (text) {
      yield text
    }
  }
}
