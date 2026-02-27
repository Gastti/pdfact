import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentCard } from '@/components/documents/DocumentCard'
import type { Document } from '@/lib/supabase/types'

vi.mock('next/navigation', () => ({
	useRouter: () => ({ refresh: vi.fn() }),
}))

const makeDoc = (overrides: Partial<Document> = {}): Document => ({
	id: 'doc-1',
	user_id: 'user-1',
	name: 'informe.pdf',
	file_path: 'user-1/123-informe.pdf',
	created_at: '2024-06-15T10:00:00Z',
	...overrides,
})

describe('DocumentCard', () => {
	it('renders document name', () => {
		render(<DocumentCard document={makeDoc({ name: 'contrato.pdf' })} />)
		expect(screen.getByText('contrato.pdf')).toBeInTheDocument()
	})

	it('renders formatted date', () => {
		render(<DocumentCard document={makeDoc({ created_at: '2024-06-15T10:00:00Z' })} />)
		expect(screen.getByText(/15/)).toBeInTheDocument()
	})

	it('has a link to chat', () => {
		render(<DocumentCard document={makeDoc({ id: 'abc-123' })} />)
		const links = screen.getAllByRole('link')
		const chatLink = links.find((link) => link.getAttribute('href') === '/documents/abc-123/chat')
		expect(chatLink).toBeDefined()
	})

	it('has a delete button', () => {
		render(<DocumentCard document={makeDoc()} />)
		expect(screen.getByRole('button')).toBeInTheDocument()
	})
})
