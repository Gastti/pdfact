import { createRequire } from 'module'
import { pathToFileURL } from 'url'
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs'

// Usamos createRequire para resolver el path del worker via el algoritmo de resolución
// de módulos de Node.js, en vez de hardcodear process.cwd() + node_modules/.
// Esto funciona correctamente tanto en local como en Vercel serverless.
const _require = createRequire(import.meta.url)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
;(pdfjs as any).GlobalWorkerOptions.workerSrc = pathToFileURL(
  _require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs'),
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
