'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react'
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

export function MessageBubble({ role, content, streaming = false, sources }: Props) {
	const [expandedSource, setExpandedSource] = useState<string | null>(null)
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
			{/* Assistant message — editorial style with left accent */}
			<div className="border-l-2 border-[#58a6ff]/25 pl-4">
				<div className="text-sm leading-[1.75] text-foreground/90">
					{content || (streaming ? '' : '…')}
					{streaming && (
						<span className="ml-1 inline-flex items-center gap-0.5 align-middle">
							<span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#58a6ff]" />
						</span>
					)}
				</div>

				{/* Sources */}
				{sources && sources.length > 0 && (
					<div className="mt-3 flex flex-col gap-2">
						<span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/40">
							Fuentes
						</span>
						<div className="flex flex-wrap gap-1.5">
							{sources.map((source) => {
								const isExpanded = expandedSource === source.id
								return (
									<div key={source.id} className="flex flex-col gap-1.5">
										<button
											onClick={() =>
												setExpandedSource(isExpanded ? null : source.id)
											}
											className={cn(
												'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all',
												isExpanded
													? 'bg-[#58a6ff]/10 text-[#58a6ff]'
													: 'bg-secondary/50 text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
											)}
										>
											<BookOpen className="h-3 w-3" />
											<span>#{source.chunk_index + 1}</span>
											{isExpanded ? (
												<ChevronUp className="h-3 w-3" />
											) : (
												<ChevronDown className="h-3 w-3" />
											)}
										</button>

										{isExpanded && (
											<div className="rounded-lg border border-border/40 bg-card/60 px-3.5 py-3 text-xs leading-relaxed text-muted-foreground">
												{source.content}
												{source.content.length >= 300 && (
													<span className="text-muted-foreground/30">
														{' '}
														…
													</span>
												)}
											</div>
										)}
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
