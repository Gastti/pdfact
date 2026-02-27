import { describe, it, expect } from 'vitest'
import { chunkText } from '@/lib/pdf/chunker'

describe('chunkText', () => {
  it('returns empty array for empty string', () => {
    expect(chunkText('')).toEqual([])
  })

  it('returns empty array for whitespace-only string', () => {
    expect(chunkText('   \n  ')).toEqual([])
  })

  it('returns a single chunk for short text', () => {
    const text = 'Hello world'
    expect(chunkText(text)).toEqual(['Hello world'])
  })

  it('splits long text into multiple chunks', () => {
    const text = 'a'.repeat(5000)
    const chunks = chunkText(text, 2000, 200)
    expect(chunks.length).toBeGreaterThan(1)
  })

  it('each chunk is at most chunkSize characters', () => {
    const text = 'x'.repeat(6000)
    const chunks = chunkText(text, 2000, 200)
    for (const chunk of chunks) {
      expect(chunk.length).toBeLessThanOrEqual(2000)
    }
  })

  it('covers the full text with overlap', () => {
    // Last chunk should include the very end of the text
    const text = 'abcde'.repeat(1000) // 5000 chars
    const chunks = chunkText(text, 2000, 200)
    const lastChunk = chunks[chunks.length - 1]
    expect(text.endsWith(lastChunk.trimEnd())).toBe(true)
  })

  it('uses default chunkSize and overlap', () => {
    const text = 'w'.repeat(4500)
    const chunks = chunkText(text)
    // With default 2000/200: chunk1=0-2000, chunk2=1800-3800, chunk3=3600-4500
    expect(chunks.length).toBe(3)
  })
})
