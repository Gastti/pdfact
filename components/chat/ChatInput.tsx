'use client'

import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowUp, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
	onSend: (message: string) => void
	disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: Props) {
	const ref = useRef<HTMLTextAreaElement>(null)
	const [hasContent, setHasContent] = useState(false)

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
		if (ref.current) {
			ref.current.value = ''
			ref.current.style.height = 'auto'
		}
		setHasContent(false)
	}

	function handleInput() {
		const el = ref.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = `${Math.min(el.scrollHeight, 160)}px`
		setHasContent(el.value.trim().length > 0)
	}

	const canSend = hasContent && !disabled

	return (
		<div className="bg-background pb-5 pt-3">
			<div className="mx-auto max-w-2xl px-4">
				<div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card py-2.5 pl-4 pr-2.5 shadow-[0_-2px_20px_rgba(0,0,0,0.15)] transition-all duration-200 focus-within:border-[#58a6ff]/30 focus-within:shadow-[0_0_0_1px_rgba(88,166,255,0.08),_0_-2px_24px_rgba(0,0,0,0.2)]">
					<textarea
						ref={ref}
						onKeyDown={handleKeyDown}
						onInput={handleInput}
						disabled={disabled}
						placeholder="Hacé una pregunta sobre el documento…"
						rows={1}
						className="max-h-40 flex-1 resize-none bg-transparent py-1.5 text-base leading-relaxed placeholder:text-muted-foreground/35 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					/>
					<button
						onClick={submit}
						disabled={!canSend}
						aria-label="Enviar"
						className={cn(
							'mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
							canSend
								? 'cursor-pointer bg-[#58a6ff] text-[#0d1117] shadow-[0_0_12px_rgba(88,166,255,0.15)] hover:bg-[#79b8ff] hover:shadow-[0_0_20px_rgba(88,166,255,0.3)] active:scale-95'
								: disabled
									? 'cursor-not-allowed bg-secondary text-muted-foreground opacity-50'
									: 'cursor-default bg-secondary/60 text-muted-foreground/25'
						)}
					>
						{disabled ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ArrowUp className="h-4 w-4" strokeWidth={2.5} />
						)}
					</button>
				</div>
				<p className="mt-2 hidden text-center text-[11px] text-muted-foreground/20 md:block">
					Enter para enviar · Shift+Enter nueva línea
				</p>
			</div>
		</div>
	)
}
