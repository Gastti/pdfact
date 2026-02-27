import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCreate } = vi.hoisted(() => {
  const mockCreate = vi.fn()
  return { mockCreate }
})

vi.mock('groq-sdk', () => {
  class MockGroq {
    chat = {
      completions: {
        create: mockCreate,
      },
    }
  }
  return { default: MockGroq }
})

import { streamChatResponse } from '@/lib/gemini/chat'
import type { MatchChunksResult } from '@/lib/supabase/types'

const makeChunk = (overrides: Partial<MatchChunksResult> = {}): MatchChunksResult => ({
  id: 'chunk-1',
  content: 'Este es el contenido del fragmento relevante.',
  chunk_index: 0,
  similarity: 0.9,
  ...overrides,
})

function makeStream(texts: string[]) {
  return {
    [Symbol.asyncIterator]: async function* () {
      for (const text of texts) {
        yield { choices: [{ delta: { content: text } }] }
      }
    },
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  mockCreate.mockResolvedValue(makeStream(['hola ', 'mundo']))
})

describe('streamChatResponse', () => {
  it('is an async generator', async () => {
    const gen = streamChatResponse('¿De qué trata?', [makeChunk()])
    expect(typeof gen[Symbol.asyncIterator]).toBe('function')
  })

  it('yields text from the model stream', async () => {
    const chunks: string[] = []
    for await (const text of streamChatResponse('¿De qué trata?', [makeChunk()])) {
      chunks.push(text)
    }
    expect(chunks.length).toBeGreaterThan(0)
    expect(chunks.every((c) => typeof c === 'string')).toBe(true)
  })

  it('includes context chunks numbered in the messages', async () => {
    const contextChunks = [
      makeChunk({ content: 'Primer fragmento', chunk_index: 0 }),
      makeChunk({ id: 'chunk-2', content: 'Segundo fragmento', chunk_index: 1 }),
    ]

    for await (const _ of streamChatResponse('pregunta', contextChunks)) {
      // consumir generator
    }

    expect(mockCreate).toHaveBeenCalledOnce()
    const args = mockCreate.mock.calls[0][0]
    const userMsg: string = args.messages.find((m: { role: string }) => m.role === 'user')?.content
    expect(userMsg).toContain('[1]')
    expect(userMsg).toContain('[2]')
    expect(userMsg).toContain('Primer fragmento')
    expect(userMsg).toContain('Segundo fragmento')
  })

  it('includes the question in the messages', async () => {
    for await (const _ of streamChatResponse('¿Cuándo fue aprobado?', [makeChunk()])) {
      // consumir generator
    }

    const args = mockCreate.mock.calls[0][0]
    const userMsg: string = args.messages.find((m: { role: string }) => m.role === 'user')?.content
    expect(userMsg).toContain('¿Cuándo fue aprobado?')
  })

  it('works with empty context chunks', async () => {
    const chunks: string[] = []
    for await (const text of streamChatResponse('pregunta sin contexto', [])) {
      chunks.push(text)
    }
    expect(Array.isArray(chunks)).toBe(true)
  })

  it('skips empty text chunks from model', async () => {
    mockCreate.mockResolvedValue(makeStream(['hola', '']))
    const chunks: string[] = []
    for await (const text of streamChatResponse('pregunta', [makeChunk()])) {
      chunks.push(text)
    }
    expect(chunks).not.toContain('')
    expect(chunks).toContain('hola')
  })
})
