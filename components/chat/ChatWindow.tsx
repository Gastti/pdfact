'use client'

import { useEffect, useRef, useState } from 'react'
import { FileText, MessageSquareText } from 'lucide-react'
import { MessageBubble, type Source } from './MessageBubble'
import { ChatInput } from './ChatInput'
import type { Message } from '@/lib/supabase/types'

type ChatMessage = {
	id: string
	role: 'user' | 'assistant'
	content: string
	streaming?: boolean
	sources?: Source[]
}

type Props = {
	conversationId: string
	documentName: string
	initialMessages: Message[]
}

const SUGGESTED_QUESTIONS = [
	'¿De qué trata este documento?',
	'Resumime los puntos principales',
	'¿Cuáles son las conclusiones?',
]

export function ChatWindow({ conversationId, documentName, initialMessages }: Props) {
	const [messages, setMessages] = useState<ChatMessage[]>(
		initialMessages.map((m) => ({
			id: m.id,
			role: m.role,
			content: m.content,
		}))
	)
	const [isStreaming, setIsStreaming] = useState(false)
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	async function handleSend(text: string) {
		if (isStreaming) return

		const userMsgId = crypto.randomUUID()
		const assistantMsgId = crypto.randomUUID()

		setMessages((prev) => [
			...prev,
			{ id: userMsgId, role: 'user', content: text },
			{ id: assistantMsgId, role: 'assistant', content: '', streaming: true },
		])
		setIsStreaming(true)

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ conversationId, message: text }),
			})

			if (!response.ok || !response.body) {
				throw new Error(`HTTP ${response.status}`)
			}

			let sources: Source[] = []
			const sourcesHeader = response.headers.get('X-Sources')
			if (sourcesHeader) {
				try {
					sources = JSON.parse(decodeURIComponent(sourcesHeader))
				} catch {
					// header inválido
				}
			}

			const reader = response.body.getReader()
			const decoder = new TextDecoder()
			let fullText = ''

			while (true) {
				const { done, value } = await reader.read()
				if (done) break
				const chunk = decoder.decode(value, { stream: true })
				fullText += chunk

				setMessages((prev) =>
					prev.map((m) =>
						m.id === assistantMsgId ? { ...m, content: fullText } : m
					)
				)
			}

			setMessages((prev) =>
				prev.map((m) =>
					m.id === assistantMsgId ? { ...m, streaming: false, sources } : m
				)
			)
		} catch (err) {
			console.error('[ChatWindow] Stream error:', err)
			setMessages((prev) =>
				prev.map((m) =>
					m.id === assistantMsgId
						? {
								...m,
								content: 'Hubo un error al generar la respuesta. Intentá de nuevo.',
								streaming: false,
							}
						: m
				)
			)
		} finally {
			setIsStreaming(false)
		}
	}

	return (
		<div className="flex h-full flex-col">
			{/* Header — document context bar */}
			<div className="flex items-center gap-3 border-b border-border px-5 py-3">
				<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#58a6ff]/10 text-[#58a6ff]">
					<FileText className="h-3.5 w-3.5" />
				</div>
				<p className="min-w-0 truncate text-sm font-medium">{documentName}</p>
			</div>

			{/* Messages area */}
			<div className="relative flex-1 overflow-y-auto">
				{messages.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center px-6">
						<div className="animate-auth-fade-up max-w-md text-center">
							<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/60 bg-card">
								<MessageSquareText className="h-7 w-7 text-[#58a6ff]" />
							</div>
							<h2 className="font-display text-2xl text-foreground">
								Preguntale al documento
							</h2>
							<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
								Hacé preguntas sobre{' '}
								<span className="font-medium text-foreground">{documentName}</span>{' '}
								y la IA te responde con fragmentos relevantes.
							</p>

							{/* Suggested questions */}
							<div
								className="animate-auth-fade-up mt-8 flex flex-col gap-2"
								style={{ animationDelay: '150ms' }}
							>
								{SUGGESTED_QUESTIONS.map((q) => (
									<button
										key={q}
										onClick={() => handleSend(q)}
										className="rounded-xl border border-border/60 bg-card px-4 py-3 text-left text-sm text-muted-foreground transition-all hover:border-[#58a6ff]/30 hover:bg-card/80 hover:text-foreground"
									>
										{q}
									</button>
								))}
							</div>
						</div>
					</div>
				) : (
					<>
						<div className="py-6">
							<div className="mx-auto flex max-w-2xl flex-col gap-1 px-5">
								{messages.map((msg) => (
									<MessageBubble
										key={msg.id}
										role={msg.role}
										content={msg.content}
										streaming={msg.streaming}
										sources={msg.sources}
									/>
								))}
								<div ref={bottomRef} />
							</div>
						</div>

						{/* Fade gradient at the bottom for smooth transition to input */}
						<div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent" />
					</>
				)}
			</div>

			{/* Input */}
			<ChatInput onSend={handleSend} disabled={isStreaming} />
		</div>
	)
}
