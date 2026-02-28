import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HF_API_KEY!)

export async function generateEmbedding(text: string): Promise<number[]> {
  const result = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
    provider: 'hf-inference',
  })

  // El SDK retorna number[] para un solo string input
  if (Array.isArray(result) && typeof result[0] === 'number') {
    return result as number[]
  }

  // Fallback: number[][] → tomar el primero
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0] as number[]
  }

  throw new Error('Formato de respuesta inesperado de HF')
}

// Batch: una sola llamada a HF para todos los textos → number[][]
export async function generateEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
  if (texts.length === 0) return []

  const result = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: texts,
    provider: 'hf-inference',
  })

  // inputs: string[] → result: number[][]
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return (result as number[][]).map((v) => (v.length > 0 ? v : null))
  }

  return texts.map(() => null)
}
