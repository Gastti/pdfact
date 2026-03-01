'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { Check, Copy, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Source = {
	id: string
	content: string
	chunk_index: number
}

type Props = {
	role: 'user' | 'assistant'
	content: string
	streaming?: boolean
	sources?: Source[]
}

function CitationBadge({ number, source }: { number: number; source: Source }) {
	return (
		<PopoverPrimitive.Root>
			<PopoverPrimitive.Trigger asChild>
				<button
					aria-label={`Ver cita ${number}`}
					className={cn(
						'relative mx-[3px] inline-flex h-[18px] w-[18px] cursor-pointer select-none',
						'items-center justify-center rounded-full align-middle',
						'border border-[#58a6ff]/35 bg-[#58a6ff]/10',
						'font-mono text-[9px] font-semibold leading-none text-[#58a6ff]',
						'transition-all duration-150 outline-none',
						'hover:border-[#58a6ff]/60 hover:bg-[#58a6ff]/20 hover:shadow-[0_0_6px_rgba(88,166,255,0.2)]',
						'data-[state=open]:border-[#58a6ff]/70 data-[state=open]:bg-[#58a6ff]/25 data-[state=open]:shadow-[0_0_8px_rgba(88,166,255,0.3)]',
						'focus-visible:ring-1 focus-visible:ring-[#58a6ff]/50',
					)}
				>
					{number}
				</button>
			</PopoverPrimitive.Trigger>

			<PopoverPrimitive.Portal>
				<PopoverPrimitive.Content
					side="top"
					sideOffset={10}
					collisionPadding={16}
					className={cn(
						'z-50 w-72 overflow-hidden rounded-xl',
						'border border-[#30363d] bg-[#161b22]',
						'shadow-2xl shadow-black/70',
						'animate-in fade-in-0 zoom-in-95 duration-150 data-[state=open]:slide-in-from-bottom-1',
						'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
					)}
				>
					{/* Accent bar */}
					<div className="h-[2px] w-full bg-gradient-to-r from-[#58a6ff]/70 via-[#58a6ff]/25 to-transparent" />

					<div className="px-3.5 py-3">
						{/* Header */}
						<div className="mb-2.5 flex items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<span className="inline-flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 font-mono text-[8px] font-semibold text-[#58a6ff]">
									{number}
								</span>
								<span className="text-[10px] font-medium uppercase tracking-widest text-[#8b949e]/50">
									Fragmento {source.chunk_index + 1}
								</span>
							</div>
							<PopoverPrimitive.Close
								aria-label="Cerrar"
								className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[#8b949e]/40 transition-colors hover:bg-[#21262d] hover:text-[#8b949e]"
							>
								<X className="h-3 w-3" />
							</PopoverPrimitive.Close>
						</div>

						{/* Content */}
						<p className="text-[11px] leading-relaxed text-[#8b949e]">
							{source.content.length > 280
								? source.content.slice(0, 280) + '…'
								: source.content}
						</p>
					</div>

					<PopoverPrimitive.Arrow className="fill-[#30363d]" width={10} height={5} />
				</PopoverPrimitive.Content>
			</PopoverPrimitive.Portal>
		</PopoverPrimitive.Root>
	)
}

function CopyButton({ content }: { content: string }) {
	const [state, setState] = useState<'idle' | 'copied'>('idle')

	async function copy() {
		if (state === 'copied') return
		const plain = content
			.replace(/\[(\d+)\]/g, '')
			.replace(/\*\*([^*]+)\*\*/g, '$1')
			.replace(/\*([^*]+)\*/g, '$1')
			.replace(/#{1,6} /g, '')
			.replace(/`([^`]+)`/g, '$1')
			.trim()
		try {
			await navigator.clipboard.writeText(plain)
		} catch {
			// Fallback para HTTP o browsers sin clipboard API
			const el = document.createElement('textarea')
			el.value = plain
			el.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
			document.body.appendChild(el)
			el.select()
			document.execCommand('copy')
			document.body.removeChild(el)
		}
		setState('copied')
		setTimeout(() => setState('idle'), 2000)
	}

	return (
		<button
			onClick={copy}
			aria-label={state === 'copied' ? 'Copiado' : 'Copiar respuesta'}
			className={cn(
				'mt-2 flex min-h-[36px] items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-medium',
				'transition-all duration-200 outline-none',
				state === 'copied'
					? 'text-[#3fb950]'
					: 'text-[#8b949e]/50 hover:bg-[#21262d] hover:text-[#8b949e] focus-visible:bg-[#21262d] focus-visible:text-[#8b949e]',
			)}
		>
			<span
				className={cn(
					'transition-transform duration-150',
					state === 'copied' ? 'scale-110' : 'scale-100',
				)}
			>
				{state === 'copied' ? (
					<Check className="h-3 w-3" strokeWidth={2.5} />
				) : (
					<Copy className="h-3 w-3" />
				)}
			</span>
			<span>{state === 'copied' ? 'Copiado' : 'Copiar'}</span>
		</button>
	)
}

// Renders a text string, replacing [N] tokens with CitationBadge components
function renderTextWithCitations(text: string, sources: Source[]) {
	const parts = text.split(/(\[\d+\])/)
	if (parts.length === 1) return [<React.Fragment key={0}>{text}</React.Fragment>]
	return parts.map((part, i) => {
		const match = part.match(/^\[(\d+)\]$/)
		if (match) {
			const num = parseInt(match[1], 10)
			const source = sources[num - 1]
			if (source) return <CitationBadge key={i} number={num} source={source} />
		}
		return <React.Fragment key={i}>{part}</React.Fragment>
	})
}

// Walks React children and processes string nodes for citations
function processNodes(children: React.ReactNode, sources: Source[]): React.ReactNode {
	return React.Children.map(children, (child) => {
		if (typeof child === 'string') {
			return renderTextWithCitations(child, sources)
		}
		return child
	})
}

type MarkdownContentProps = { content: string; sources: Source[]; streaming: boolean }

function MarkdownContent({ content, sources, streaming }: MarkdownContentProps) {
	const hasSources = sources.length > 0

	return (
		<ReactMarkdown
			components={{
				// Paragraphs
				p: ({ children }) => (
					<p className="mb-2 last:mb-0 leading-[1.75]">
						{hasSources ? processNodes(children, sources) : children}
					</p>
				),
				// Unordered lists
				ul: ({ children }) => (
					<ul className="mb-2 list-disc pl-5 space-y-0.5 last:mb-0">{children}</ul>
				),
				// Ordered lists
				ol: ({ children }) => (
					<ol className="mb-2 list-decimal pl-5 space-y-0.5 last:mb-0">{children}</ol>
				),
				li: ({ children }) => (
					<li className="leading-[1.75]">
						{hasSources ? processNodes(children, sources) : children}
					</li>
				),
				// Bold / italic
				strong: ({ children }) => (
					<strong className="font-semibold text-foreground">{children}</strong>
				),
				em: ({ children }) => <em className="italic">{children}</em>,
				// Inline code
				code: ({ children }) => (
					<code className="rounded bg-[#30363d] px-1 py-0.5 font-mono text-xs text-[#e6edf3]">
						{children}
					</code>
				),
				// Code blocks
				pre: ({ children }) => (
					<pre className="mb-2 overflow-x-auto rounded-lg bg-[#161b22] p-3 font-mono text-xs text-[#e6edf3] last:mb-0">
						{children}
					</pre>
				),
				// Headings
				h1: ({ children }) => (
					<h1 className="mb-1 mt-3 text-base font-semibold text-foreground first:mt-0">{children}</h1>
				),
				h2: ({ children }) => (
					<h2 className="mb-1 mt-3 text-sm font-semibold text-foreground first:mt-0">{children}</h2>
				),
				h3: ({ children }) => (
					<h3 className="mb-1 mt-2 text-sm font-medium text-foreground first:mt-0">{children}</h3>
				),
				// Horizontal rule
				hr: () => <hr className="my-3 border-t border-[#30363d]" />,
			}}
		>
			{content}
		</ReactMarkdown>
	)
}

export function MessageBubble({ role, content, streaming = false, sources }: Props) {
	const isUser = role === 'user'

	if (isUser) {
		return (
			<div className="flex justify-end py-3">
				<div className="max-w-[80%] rounded-2xl rounded-br-md bg-[#58a6ff]/10 px-4 py-3 text-sm leading-relaxed text-foreground">
					{content}
				</div>
			</div>
		)
	}

	return (
		<div className="py-3">
			<div className="border-l-2 border-[#58a6ff]/25 pl-4">
				<div className="text-sm text-foreground/90">
					{content ? (
						<MarkdownContent
							content={content}
							sources={sources ?? []}
							streaming={streaming}
						/>
					) : streaming ? (
						''
					) : (
						'…'
					)}
					{streaming && (
						<span className="ml-1 inline-flex items-center gap-0.5 align-middle">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#58a6ff]" />
						</span>
					)}
				</div>
				{!streaming && content && <CopyButton content={content} />}
			</div>
		</div>
	)
}
