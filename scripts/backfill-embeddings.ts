import { config } from 'dotenv'
config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { HfInference } from '@huggingface/inference'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const hf = new HfInference(process.env.HF_API_KEY!)

async function generateEmbedding(text: string): Promise<number[]> {
  const result = await hf.featureExtraction({
    model: 'sentence-transformers/all-MiniLM-L6-v2',
    inputs: text,
  })
  if (Array.isArray(result) && typeof result[0] === 'number') return result as number[]
  if (Array.isArray(result) && Array.isArray(result[0])) return result[0] as number[]
  throw new Error('Unexpected HF response')
}

async function main() {
  const { data: chunks, error } = await supabase
    .from('chunks')
    .select('id, content')
    .is('embedding', null)

  if (error) {
    console.error('Error fetching chunks:', error)
    process.exit(1)
  }

  console.log(`Found ${chunks.length} chunks without embeddings`)

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    try {
      const embedding = await generateEmbedding(chunk.content)
      await supabase
        .from('chunks')
        .update({ embedding })
        .eq('id', chunk.id)
      console.log(`[${i + 1}/${chunks.length}] ✓ ${chunk.id}`)
    } catch (err) {
      console.error(`[${i + 1}/${chunks.length}] ✗ ${chunk.id}:`, err)
    }
  }

  console.log('Done!')
}

main()
