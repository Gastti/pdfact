'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
	FileText,
	MessageSquare,
	PanelLeftClose,
	PanelLeft,
	LogOut,
	ChevronsUpDown,
	Plus,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { useLogout } from './LogoutButton'

type ChatItem = {
	documentId: string
	documentName: string
	createdAt: string
}

type UserInfo = {
	email: string | null
	name: string | null
}

type Props = {
	chats: ChatItem[]
	user: UserInfo
}

const MIN_WIDTH = 200
const MAX_WIDTH = 400
const DEFAULT_WIDTH = 256

function formatDate(isoString: string): string {
	return new Intl.DateTimeFormat('es-AR', { dateStyle: 'short' }).format(new Date(isoString))
}

function getInitials(name: string | null, email: string | null): string {
	if (name) return name[0].toUpperCase()
	if (email) return email[0].toUpperCase()
	return '?'
}

function getDisplayName(name: string | null): string {
	if (name && name.trim()) return name
	return 'Usuario'
}

function LogoIcon({ size = 14 }: { size?: number }) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
			<path d="M14 2v4a2 2 0 0 0 2 2h4" />
			<path d="M10 12h4" />
			<path d="M10 16h4" />
		</svg>
	)
}

export function ChatSidebar({ chats, user }: Props) {
	const pathname = usePathname()
	const logout = useLogout()
	const [collapsed, setCollapsed] = useState(false)
	const [width, setWidth] = useState(DEFAULT_WIDTH)
	const isResizing = useRef(false)
	const sidebarRef = useRef<HTMLDivElement>(null)

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		e.preventDefault()
		isResizing.current = true
		document.body.style.cursor = 'col-resize'
		document.body.style.userSelect = 'none'
	}, [])

	useEffect(() => {
		function handleMouseMove(e: MouseEvent) {
			if (!isResizing.current) return
			const sidebar = sidebarRef.current
			if (!sidebar) return
			const rect = sidebar.getBoundingClientRect()
			const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, e.clientX - rect.left))
			setWidth(newWidth)
		}

		function handleMouseUp() {
			if (!isResizing.current) return
			isResizing.current = false
			document.body.style.cursor = ''
			document.body.style.userSelect = ''
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
		return () => {
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}
	}, [])

	const isNewChat = pathname === '/new'

	if (collapsed) {
		return (
			<div className="flex w-12 shrink-0 flex-col items-center justify-between border-r border-border bg-card/50 py-3">
				<TooltipProvider delayDuration={200}>
					<div className="flex flex-col items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									onClick={() => setCollapsed(false)}
									className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
								>
									<PanelLeft className="h-4 w-4" />
								</button>
							</TooltipTrigger>
							<TooltipContent side="right">Abrir sidebar</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href="/new"
									className={cn(
										'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
										isNewChat
											? 'bg-[#58a6ff]/10 text-[#58a6ff]'
											: 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
									)}
								>
									<Plus className="h-4 w-4" />
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right">Nuevo chat</TooltipContent>
						</Tooltip>
					</div>

					<Tooltip>
						<TooltipTrigger asChild>
							<Avatar className="h-8 w-8 border border-border">
								<AvatarFallback className="bg-secondary text-xs text-muted-foreground">
									{getInitials(user.name, user.email)}
								</AvatarFallback>
							</Avatar>
						</TooltipTrigger>
						<TooltipContent side="right">
							{getDisplayName(user.name)}
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
	}

	return (
		<div
			ref={sidebarRef}
			className="relative flex shrink-0 flex-col border-r border-border bg-card/50"
			style={{ width, minWidth: width, maxWidth: width }}
		>
			{/* Logo + collapse */}
			<div className="flex items-center justify-between border-b border-border px-4 py-3">
				<Link href="/new" className="flex items-center gap-2.5 overflow-hidden">
					<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#58a6ff]/10 text-[#58a6ff]">
						<LogoIcon />
					</div>
					<span className="truncate text-sm font-medium tracking-tight text-foreground">
						PDFact
					</span>
				</Link>
				<button
					onClick={() => setCollapsed(true)}
					className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
				>
					<PanelLeftClose className="h-4 w-4" />
				</button>
			</div>

			{/* New chat button */}
			<div className="p-2 pb-0">
				<Link
					href="/new"
					className={cn(
						'flex items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
						isNewChat
							? 'bg-[#58a6ff]/10 text-[#58a6ff]'
							: 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
					)}
				>
					<Plus className="h-4 w-4 shrink-0" />
					<span className="truncate">Nuevo chat</span>
				</Link>
			</div>

			{/* Chat list header */}
			<div className="flex items-center gap-2 px-4 pb-1 pt-3">
				<MessageSquare className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
				<span className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
					Chats
				</span>
				<span className="ml-auto shrink-0 text-[11px] tabular-nums text-muted-foreground/40">
					{chats.length}
				</span>
			</div>

			{/* Chat list */}
			<div className="flex-1 overflow-x-hidden overflow-y-auto">
				{chats.length === 0 ? (
					<div className="flex flex-col items-center px-4 py-10 text-center">
						<p className="text-xs leading-relaxed text-muted-foreground/50">
							Tus chats aparecerán acá.
						</p>
					</div>
				) : (
					<nav className="flex flex-col gap-0.5 p-2">
						{chats.map((chat) => {
							const href = `/documents/${chat.documentId}/chat`
							const isActive = pathname === href

							return (
								<Link
									key={chat.documentId}
									href={href}
									title={chat.documentName}
									className={cn(
										'group flex items-start gap-3 overflow-hidden rounded-lg px-3 py-2.5 transition-colors',
										isActive
											? 'bg-[#58a6ff]/10 text-foreground'
											: 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
									)}
								>
									<div
										className={cn(
											'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
											isActive
												? 'bg-[#58a6ff]/15 text-[#58a6ff]'
												: 'bg-secondary/80 text-muted-foreground group-hover:text-foreground'
										)}
									>
										<FileText className="h-3.5 w-3.5" />
									</div>
									<div className="min-w-0 flex-1 overflow-hidden">
										<p className="truncate text-sm font-medium leading-snug">
											{chat.documentName}
										</p>
										<p className="mt-0.5 truncate text-[11px] text-muted-foreground">
											{formatDate(chat.createdAt)}
										</p>
									</div>
								</Link>
							)
						})}
					</nav>
				)}
			</div>

			{/* User profile footer */}
			<div className="relative border-t border-border p-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-left outline-none transition-colors hover:bg-secondary/60">
							<Avatar className="h-8 w-8 shrink-0 border border-border">
								<AvatarFallback className="bg-secondary text-xs text-muted-foreground">
									{getInitials(user.name, user.email)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0 flex-1 overflow-hidden">
								<p className="truncate text-sm font-medium leading-snug text-foreground">
									{getDisplayName(user.name)}
								</p>
								{user.email && (
									<p className="truncate text-[11px] text-muted-foreground">
										{user.email}
									</p>
								)}
							</div>
							<ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						side="top"
						align="center"
						sideOffset={6}
						className="w-[calc(var(--radix-dropdown-menu-trigger-width)+2px)]"
					>
						<div className="px-2 py-1.5">
							<p className="truncate text-sm font-medium">
								{getDisplayName(user.name)}
							</p>
							<p className="truncate text-xs text-muted-foreground">
								{user.email ?? '—'}
							</p>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={logout}
							className="text-destructive focus:text-destructive"
						>
							<LogOut className="mr-2 h-3.5 w-3.5" />
							Cerrar sesión
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Resize handle */}
			<div
				onMouseDown={handleMouseDown}
				className="absolute -right-1 top-0 z-10 h-full w-2 cursor-col-resize hover:bg-[#58a6ff]/10 active:bg-[#58a6ff]/15"
			/>
		</div>
	)
}
