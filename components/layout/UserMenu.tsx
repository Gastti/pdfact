'use client'

import { LogOut, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from './LogoutButton'

type Props = {
	email: string | null
}

function getInitials(email: string | null): string {
	if (!email) return '?'
	return email[0].toUpperCase()
}

export function UserMenu({ email }: Props) {
	const logout = useLogout()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button className="flex items-center gap-2 rounded-full outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring">
					<Avatar className="h-8 w-8 border border-border">
						<AvatarFallback className="bg-secondary text-xs text-muted-foreground">
							{getInitials(email)}
						</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-56">
				<DropdownMenuLabel className="font-normal">
					<div className="flex items-center gap-2">
						<User className="h-3.5 w-3.5 text-muted-foreground" />
						<span className="truncate text-sm text-muted-foreground">{email ?? '—'}</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
					<LogOut className="mr-2 h-3.5 w-3.5" />
					Cerrar sesión
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
