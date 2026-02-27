'use client'

import { Tooltip as TooltipPrimitive } from 'radix-ui'
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
		<TooltipPrimitive.Provider delayDuration={120}>
			<TooltipPrimitive.Root>
				<TooltipPrimitive.Trigger asChild>
					<span
						className={cn(
							'relative mx-[2px] inline-flex h-[17px] w-[17px] cursor-default select-none',
							'items-center justify-center rounded-full align-middle',
							'border border-[#58a6ff]/30 bg-[#58a6ff]/10',
							'font-mono text-[9px] font-semibold leading-none text-[#58a6ff]',
							'transition-all duration-150',
							'hover:scale-110 hover:border-[#58a6ff]/55 hover:bg-[#58a6ff]/20',
						)}
					>
						{number}
					</span>
				</TooltipPrimitive.Trigger>

				<TooltipPrimitive.Portal>
					<TooltipPrimitive.Content
						side="top"
						sideOffset={8}
						collisionPadding={16}
						className={cn(
							'z-50 w-72 rounded-xl',
							'border border-[#30363d] bg-[#161b22]',
							'shadow-xl shadow-black/50',
							'animate-in fade-in-0 zoom-in-95',
							'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
							'data-[side=top]:slide-in-from-bottom-1',
							'data-[side=bottom]:slide-in-from-top-1',
						)}
					>
						<div className="px-3.5 py-3">
							{/* Header */}
							<div className="mb-2 flex items-center gap-1.5">
								<span className="inline-flex h-[15px] w-[15px] items-center justify-center rounded-full border border-[#58a6ff]/30 bg-[#58a6ff]/10 font-mono text-[8px] font-semibold text-[#58a6ff]">
									{number}
								</span>
								<span className="text-[10px] font-medium uppercase tracking-wider text-[#8b949e]/60">
									Fragmento {source.chunk_index + 1}
								</span>
							</div>

							{/* Content */}
							<p className="text-xs leading-relaxed text-[#8b949e]">
								{source.content}
								{source.content.length >= 300 && (
									<span className="text-[#8b949e]/40"> …</span>
								)}
							</p>
						</div>

						<TooltipPrimitive.Arrow
							className="fill-[#30363d]"
							width={10}
							height={5}
						/>
					</TooltipPrimitive.Content>
				</TooltipPrimitive.Portal>
			</TooltipPrimitive.Root>
		</TooltipPrimitive.Provider>
	)
}

function renderContent(content: string, sources: Source[]) {
	const parts = content.split(/(\[\d+\])/)
	return parts.map((part, i) => {
		const match = part.match(/^\[(\d+)\]$/)
		if (match) {
			const num = parseInt(match[1], 10)
			const source = sources[num - 1]
			if (source) {
				return <CitationBadge key={i} number={num} source={source} />
			}
		}
		return <span key={i}>{part}</span>
	})
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

	const hasSources = sources && sources.length > 0
	const hasInlineCitations = !streaming && hasSources && /\[\d+\]/.test(content)

	return (
		<div className="py-3">
			<div className="border-l-2 border-[#58a6ff]/25 pl-4">
				<div className="text-sm leading-[1.75] text-foreground/90">
					{hasInlineCitations
						? renderContent(content, sources!)
						: content || (streaming ? '' : '…')}
					{streaming && (
						<span className="ml-1 inline-flex items-center gap-0.5 align-middle">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#58a6ff]" />
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
