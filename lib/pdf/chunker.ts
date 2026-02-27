export function chunkText(text: string, chunkSize = 2000, overlap = 200): string[] {
  if (!text.trim()) return []

  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    const chunk = text.slice(start, end).trim()
    if (chunk) chunks.push(chunk)
    if (end === text.length) break
    start = end - overlap
  }

  return chunks
}
