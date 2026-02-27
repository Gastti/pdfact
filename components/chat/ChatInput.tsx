'use client'

import { useRef, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
	onSend: (message: string) => void
	disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: Props) {
	const ref = useRef<HTMLTextAreaElement>(null)

	function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			submit()
		}
	}

	function submit() {
		const value = ref.current?.value.trim()
		if (!value || disabled) return
		onSend(value)
		if (ref.current) ref.current.value = ''
		if (ref.current) ref.current.style.height = 'auto'
	}

	function handleInput() {
		const el = ref.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = `${Math.min(el.scrollHeight, 160)}px`
	}

	return (
		<div className="bg-background pb-5 pt-3">
			<div className="mx-auto max-w-2xl px-5">
				<div className="rounded-2xl border border-border/60 bg-card shadow-[0_-2px_20px_rgba(0,0,0,0.15)] transition-all focus-within:border-[#58a6ff]/30 focus-within:shadow-[0_-2px_24px_rgba(0,0,0,0.2),_0_0_0_1px_rgba(88,166,255,0.08)]">
					<textarea
						ref={ref}
						onKeyDown={handleKeyDown}
						onInput={handleInput}
						disabled={disabled}
						placeholder="Hacé una pregunta sobre el documento…"
						rows={1}
						className="max-h-40 w-full resize-none bg-transparent px-4 py-3.5 text-sm leading-relaxed placeholder:text-muted-foreground/35 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					/>
					<div className="flex items-center justify-between px-3 pb-2.5">
						<p className="hidden text-[11px] text-muted-foreground/25 md:block">
							Enter enviar · Shift+Enter nueva línea
						</p>
						<button
							onClick={submit}
							disabled={disabled}
							aria-label="Enviar"
							className={cn(
								'flex h-8 w-8 items-center justify-center rounded-xl transition-all',
								'disabled:cursor-not-allowed disabled:opacity-30',
								disabled
									? 'bg-secondary text-muted-foreground'
									: 'bg-[#58a6ff] text-[#0d1117] hover:bg-[#79b8ff] hover:shadow-[0_0_16px_rgba(88,166,255,0.25)]'
							)}
						>
							{disabled ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<ArrowUp className="h-4 w-4" strokeWidth={2.5} />
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
