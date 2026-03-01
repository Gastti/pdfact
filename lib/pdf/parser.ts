// Dynamic import to avoid top-level module initialization failures in Vercel serverless.
// If pdfjs-dist fails to load (e.g. missing @napi-rs/canvas), the error surfaces inside
// extractTextFromPDF where the route handler's try/catch can catch it and return a proper
// 422 instead of a 405 (which happens when the route module fails to initialize).

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs = (await import('pdfjs-dist/legacy/build/pdf.mjs')) as any
  // Disable the web worker — pdfjs runs in the main thread in serverless environments.
  pdfjs.GlobalWorkerOptions.workerSrc = ''

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadingTask = (pdfjs as any).getDocument({ data: new Uint8Array(buffer) })
  const pdf = await loadingTask.promise

  const pageTexts: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: { str?: string }) => item.str ?? '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (pageText) pageTexts.push(pageText)
  }

  return pageTexts.join('\n\n')
}
