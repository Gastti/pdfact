import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractTextFromPDF } from '@/lib/pdf/parser'
import { chunkText } from '@/lib/pdf/chunker'
import { generateEmbedding } from '@/lib/gemini/embeddings'

export const maxDuration = 60 // segundos — necesario para PDFs con muchos chunks

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Request inválido' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Solo se aceptan archivos PDF' }, { status: 400 })
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'El archivo supera el límite de 10 MB' }, { status: 400 })
  }

  const buffer = await file.arrayBuffer()
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${user.id}/${Date.now()}-${safeName}`

  // Subir PDF a Storage
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, buffer, { contentType: 'application/pdf' })

  if (uploadError) {
    console.error('[POST /api/documents] Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 })
  }

  // Registrar documento en la DB
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .insert({ user_id: user.id, name: file.name, file_path: filePath })
    .select()
    .single()

  if (docError || !doc) {
    console.error('[POST /api/documents] DB insert error:', docError)
    await supabase.storage.from('documents').remove([filePath])
    return NextResponse.json({ error: 'Error al guardar el documento' }, { status: 500 })
  }

  // Extraer texto y chunkear
  let text: string
  try {
    text = await extractTextFromPDF(buffer)
  } catch (err) {
    console.error('[POST /api/documents] PDF extraction error:', err)
    await supabase.from('documents').delete().eq('id', doc.id)
    await supabase.storage.from('documents').remove([filePath])
    return NextResponse.json({ error: 'Error al procesar el PDF' }, { status: 422 })
  }

  const chunks = chunkText(text)

  // Generar embeddings e insertar chunks (secuencial para respetar rate limits)
  for (let i = 0; i < chunks.length; i++) {
    let embedding: number[]
    try {
      embedding = await generateEmbedding(chunks[i])
    } catch {
      // Si falla un embedding lo ignoramos — el chunk queda sin embedding
      embedding = []
    }

    await supabase.from('chunks').insert({
      document_id: doc.id,
      content: chunks[i],
      embedding: embedding.length > 0 ? embedding : null,
      chunk_index: i,
    })
  }

  return NextResponse.json(doc, { status: 201 })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  let body: { documentId: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request inválido' }, { status: 400 })
  }

  const { documentId } = body
  if (!documentId) {
    return NextResponse.json({ error: 'documentId es requerido' }, { status: 400 })
  }

  // Verificar que el documento pertenece al usuario
  const { data: doc, error: docError } = await supabase
    .from('documents')
    .select('id, file_path')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (docError || !doc) {
    return NextResponse.json({ error: 'Documento no encontrado' }, { status: 403 })
  }

  // Borrar archivo de Storage
  await supabase.storage.from('documents').remove([doc.file_path])

  // Borrar documento de DB (CASCADE elimina chunks + conversations + messages)
  const { error: deleteError } = await supabase.from('documents').delete().eq('id', doc.id)

  if (deleteError) {
    console.error('[DELETE /api/documents] DB delete error:', deleteError)
    return NextResponse.json({ error: 'Error al eliminar el documento' }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}
