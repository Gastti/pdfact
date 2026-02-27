'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [{ href: '/dashboard', icon: LayoutDashboard, label: 'Mis documentos' }]

export function AppSidebar() {
	const pathname = usePathname()

	return (
		<aside className="flex w-56 flex-col border-r bg-background">
			<nav className="flex flex-col gap-1 p-3">
				{links.map(({ href, icon: Icon, label }) => {
					const isActive = pathname === href || pathname.startsWith(href + '/')
					return (
						<Link
							key={href}
							href={href}
							className={cn(
								'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
								isActive
									? 'bg-brand/10 text-brand'
									: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
							)}
						>
							<Icon className="h-4 w-4" />
							{label}
						</Link>
					)
				})}
			</nav>
		</aside>
	)
}
