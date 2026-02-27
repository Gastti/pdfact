import { join } from 'path'
import { pathToFileURL } from 'url'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

// En Node.js, workerSrc = '' no es una URL válida para worker_threads.
// Usamos process.cwd() para construir la ruta absoluta al worker y convertirla
// a file:// URL que Node.js worker_threads puede cargar correctamente.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(pdfjs as any).GlobalWorkerOptions.workerSrc = pathToFileURL(
  join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs'),
).href

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
