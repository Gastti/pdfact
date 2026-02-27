import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentList } from '@/components/documents/DocumentList'
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

describe('DocumentList', () => {
  it('renders empty state when no documents', () => {
    render(<DocumentList documents={[]} />)
    expect(screen.getByText('Sin documentos')).toBeInTheDocument()
  })

  it('empty state description mentions uploading', () => {
    render(<DocumentList documents={[]} />)
    expect(screen.getByText(/Subí un PDF/i)).toBeInTheDocument()
  })

  it('renders document names', () => {
    const docs = [makeDoc({ name: 'contrato.pdf' }), makeDoc({ id: 'doc-2', name: 'manual.pdf' })]
    render(<DocumentList documents={docs} />)
    expect(screen.getByText('contrato.pdf')).toBeInTheDocument()
    expect(screen.getByText('manual.pdf')).toBeInTheDocument()
  })

  it('does not show empty state when documents exist', () => {
    render(<DocumentList documents={[makeDoc()]} />)
    expect(screen.queryByText('Sin documentos')).not.toBeInTheDocument()
  })

  it('renders one card per document', () => {
    const docs = [makeDoc(), makeDoc({ id: 'doc-2', name: 'otro.pdf' })]
    render(<DocumentList documents={docs} />)
    expect(screen.getByText('informe.pdf')).toBeInTheDocument()
    expect(screen.getByText('otro.pdf')).toBeInTheDocument()
  })
})
