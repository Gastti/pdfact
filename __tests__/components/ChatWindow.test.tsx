import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ChatWindow } from '@/components/chat/ChatWindow'
import type { Message } from '@/lib/supabase/types'

// Mock fetch globalmente
const mockFetch = vi.fn()
global.fetch = mockFetch

// jsdom no implementa scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  mockFetch.mockReset()
})

const baseProps = {
  conversationId: 'conv-1',
  documentName: 'informe.pdf',
  initialMessages: [] as Message[],
}

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id: crypto.randomUUID(),
  conversation_id: 'conv-1',
  role: 'user',
  content: '¿De qué trata el documento?',
  created_at: '2024-06-15T10:00:00Z',
  ...overrides,
})

describe('ChatWindow', () => {
  it('shows document name in header', () => {
    render(<ChatWindow {...baseProps} documentName="mi-doc.pdf" />)
    expect(screen.getAllByText('mi-doc.pdf').length).toBeGreaterThanOrEqual(1)
  })

  it('shows empty state when no messages', () => {
    render(<ChatWindow {...baseProps} initialMessages={[]} />)
    expect(screen.getByText('Preguntale al documento')).toBeInTheDocument()
  })

  it('renders initial user and assistant messages', () => {
    const messages: Message[] = [
      makeMessage({ role: 'user', content: '¿Qué dice el documento?' }),
      makeMessage({ role: 'assistant', content: 'El documento habla de contratos.' }),
    ]
    render(<ChatWindow {...baseProps} initialMessages={messages} />)
    expect(screen.getByText('¿Qué dice el documento?')).toBeInTheDocument()
    expect(screen.getByText('El documento habla de contratos.')).toBeInTheDocument()
  })

  it('renders the chat input', () => {
    render(<ChatWindow {...baseProps} />)
    expect(screen.getByPlaceholderText(/Hacé una pregunta/i)).toBeInTheDocument()
  })

  it('renders the send button', () => {
    render(<ChatWindow {...baseProps} />)
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument()
  })

  it('input is enabled when not streaming', () => {
    render(<ChatWindow {...baseProps} />)
    const input = screen.getByPlaceholderText(/Hacé una pregunta/i)
    expect(input).not.toBeDisabled()
  })

  it('send button is enabled when not streaming', () => {
    render(<ChatWindow {...baseProps} />)
    expect(screen.getByRole('button', { name: /Enviar/i })).not.toBeDisabled()
  })
})
