# PDFact

Chat con documentos PDF usando Retrieval-Augmented Generation (RAG). Subí un PDF, hacé preguntas y obtené respuestas basadas en el contenido del documento.

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI:** Tailwind CSS v4 + shadcn/ui
- **Auth, DB, Storage:** Supabase (pgvector para búsqueda vectorial)
- **LLM:** Groq — Llama 3.3 70B
- **Embeddings:** Hugging Face — all-MiniLM-L6-v2 (384 dims)
- **PDF Parsing:** pdfjs-dist
- **Testing:** Vitest + Testing Library

## Setup local

1. Clonar el repo e instalar dependencias:

```bash
git clone https://github.com/Gastti/pdfact
cd pdfact
npm install
```

2. Crear `.env.local` a partir del ejemplo:

```bash
cp .env.example .env.local
```

3. Configurar las variables de entorno en `.env.local` (ver `.env.example` para detalles).

4. Configurar Supabase:
   - Crear proyecto en [supabase.com](https://supabase.com)
   - Habilitar extensión `vector` (pgvector)
   - Crear las tablas: `documents`, `chunks`, `conversations`, `messages`
   - Crear bucket de Storage `documents` (privado, 10MB max, solo PDFs)
   - Configurar RLS en todas las tablas

5. Iniciar el servidor:

```bash
npm run dev
```

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción
npm run lint         # ESLint
npm run test         # Vitest en modo watch
npm run test:run     # Vitest una sola vez (CI)
```

## Estructura

```
app/
├── (auth)/           # login, register
├── dashboard/        # lista de documentos
├── documents/[id]/chat/  # chat con documento
├── api/
│   ├── documents/    # upload + delete
│   └── chat/         # Q&A con streaming
components/
├── ui/               # shadcn (no editar)
├── chat/             # ChatWindow, MessageBubble, ChatInput
├── documents/        # DocumentCard, UploadArea, DocumentList
├── layout/           # AppSidebar, AppHeader
lib/
├── supabase/         # client, server, types
├── gemini/           # embeddings (HF), chat (Groq)
├── pdf/              # parser, chunker
```
