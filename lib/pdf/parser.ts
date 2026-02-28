import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

// The legacy build is required in Node.js (polyfills browser APIs like DOMMatrix).
// Setting workerSrc to '' disables the web worker so pdfjs runs in the main thread,
// which is the correct approach for Vercel serverless environments.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(pdfjs as any).GlobalWorkerOptions.workerSrc = ''

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
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
