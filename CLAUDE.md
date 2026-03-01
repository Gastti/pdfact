# CLAUDE.md — doc-qa

Convenciones y guía de desarrollo para el proyecto **doc-qa** (Document Q&A con RAG).

---

## Skills

- **UI / Interface design**: Siempre usar `/interface-design` antes de crear o modificar componentes visuales (páginas, layouts, componentes de UI). Esta skill provee el proceso de diseño con intención, paleta, firma visual y principios de craft.

---

## Stack

| Capa                | Tecnología                                                    |
| ------------------- | ------------------------------------------------------------- |
| Framework           | Next.js 16 — App Router, TypeScript estricto                  |
| UI                  | Tailwind CSS v4 + shadcn/ui (componentes en `components/ui/`) |
| Auth + DB + Storage | Supabase (`@supabase/supabase-js` + `@supabase/ssr`)         |
| LLM                 | Groq — Llama 3.3 70B (`groq-sdk`)                            |
| Embeddings          | Hugging Face — all-MiniLM-L6-v2, 384 dims (`@huggingface/inference`) |
| Vector Search       | Supabase pgvector (extensión PostgreSQL)                      |
| PDF Parsing         | pdfjs-dist v5 — legacy build (`pdfjs-dist/legacy/build/pdf.mjs`) |
| Testing             | Vitest + Testing Library                                      |
| Deploy              | Vercel                                                        |

---

## Comandos

```bash
npm run dev          # servidor de desarrollo (http://localhost:3000)
npm run build        # build de producción
npm run lint         # ESLint
npm run test         # Vitest en modo watch
npm run test:run     # Vitest una sola vez (CI)
```

---

## Estructura de carpetas

```
doc-qa/
├── app/
│   ├── (auth)/           # grupo de rutas sin layout principal
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/        # ruta protegida — lista de documentos
│   ├── documents/
│   │   └── [id]/
│   │       └── chat/     # chat con un documento específico
│   ├── api/
│   │   ├── documents/    # POST — upload + procesamiento
│   │   └── chat/         # POST — Q&A con streaming
│   ├── layout.tsx        # layout raíz (dark mode forzado)
│   └── globals.css       # GitHub Dark theme
├── components/
│   ├── ui/               # shadcn components (no editar manualmente)
│   ├── chat/             # ChatWindow, MessageBubble, ChatInput
│   ├── documents/        # DocumentCard, UploadArea, DocumentList
│   └── layout/           # AppSidebar, AppHeader
├── lib/
│   ├── supabase/
│   │   ├── client.ts     # createBrowserClient (componentes cliente)
│   │   ├── server.ts     # createServerClient (Server Components, Route Handlers)
│   │   └── types.ts      # tipos manuales de la DB
│   ├── gemini/
│   │   ├── embeddings.ts # generateEmbedding(text) → number[] (HF all-MiniLM-L6-v2)
│   │   └── chat.ts       # streamChatResponse(prompt, context) (Groq Llama 3.3 70B)
│   └── pdf/
│       ├── parser.ts     # extractTextFromPDF(buffer) → string
│       └── chunker.ts    # chunkText(text, size?) → string[]
├── scripts/
│   └── backfill-embeddings.ts  # regenerar embeddings de chunks existentes
├── __tests__/
│   ├── setup.ts          # @testing-library/jest-dom
│   ├── lib/              # unit tests de lib/
│   └── components/       # render tests de componentes
├── proxy.ts              # protección de rutas (Next.js 16)
├── .env.example
└── PLAN.md
```

---

## Convenciones de código

### TypeScript

- `strict: true` — sin `any` implícito, sin `as any` a menos que sea inevitable
- Preferir `type` sobre `interface` para props y shapes de datos
- Los tipos de la DB van en `lib/supabase/types.ts`

### Componentes React

- Archivos `.tsx` para componentes, `.ts` para lógica pura
- Naming: PascalCase para componentes (`DocumentCard.tsx`), camelCase para utilidades
- Preferir Server Components por defecto; agregar `'use client'` solo cuando sea necesario (estado, eventos, hooks)
- Props con tipo explícito, sin prop drilling excesivo — usar Context o pasar desde Server Component

### API Routes (Route Handlers)

- Archivos en `app/api/**/route.ts`
- Exportar funciones nombradas: `GET`, `POST`, etc.
- Siempre devolver `NextResponse.json(data, { status })` con status explícito
- Validar input antes de procesar
- Errores: `{ error: string }` con status 4xx/5xx apropiado
- Headers con datos Unicode: usar `encodeURIComponent` (HTTP headers solo aceptan ASCII)

### PDF Parsing (pdfjs-dist v5)

- Importar siempre desde `pdfjs-dist/legacy/build/pdf.mjs` — el build estándar requiere APIs de browser (`DOMMatrix`, etc.) que no existen en Node.js
- Deshabilitar el web worker: `GlobalWorkerOptions.workerSrc = ''` — pdfjs corre en el hilo principal en entornos serverless (Vercel)
- **No usar** `createRequire` + `pathToFileURL` para resolver el worker path — en v5 el `_require.resolve` de `.mjs` devuelve valores inesperados durante el build de Next.js
- `next.config.ts` debe incluir `serverExternalPackages: ['pdfjs-dist']` para que no sea bundleado por webpack

### Supabase

- **Client** (`lib/supabase/client.ts`): usar en componentes con `'use client'`
- **Server** (`lib/supabase/server.ts`): usar en Server Components y Route Handlers
- Las queries siempre desestructuran `{ data, error }` y manejan el error
- RLS habilitado en todas las tablas — nunca usar service role key en el cliente
- Storage: sanitizar nombres de archivo (`replace(/[^a-zA-Z0-9._-]/g, '_')`) antes de upload

### LLM & Embeddings

- API keys nunca en el cliente — solo en Route Handlers o Server Actions
- `lib/gemini/embeddings.ts` expone `generateEmbedding(text: string): Promise<number[]>` (HF Inference SDK)
- `lib/gemini/chat.ts` expone `streamChatResponse(question, chunks)` → `AsyncGenerator<string>` (Groq SDK)
- Embeddings: 384 dimensiones (all-MiniLM-L6-v2)

### Estilos

- Tailwind CSS v4 — no usar CSS modules a menos que sea necesario
- shadcn/ui para todos los componentes base (botones, inputs, cards, dialogs)
- Dark mode forzado (`<html className="dark">`) — GitHub Dark theme
- Variables de color definidas en `app/globals.css` vía CSS custom properties (hex)

---

## Base de datos (Supabase)

### Tablas

```sql
documents     (id, user_id, name, file_path, created_at)
chunks        (id, document_id, content, embedding vector(384), chunk_index)
conversations (id, document_id, user_id, created_at)  -- UNIQUE(document_id, user_id)
messages      (id, conversation_id, role, content, created_at)
```

### pgvector

- Extensión: `CREATE EXTENSION IF NOT EXISTS vector;`
- Búsqueda por similitud coseno: `<=>` operator
- Índice HNSW en `chunks.embedding`
- Función SQL `match_chunks(query_embedding vector(384), target_document_id, match_count)`

---

## Testing

- Tests en `__tests__/`, separados en `lib/` y `components/`
- Correr con `npm run test:run` antes de cada commit
- Mocks con `vi.mock()` y `vi.hoisted()` para SDKs externos
- jsdom no implementa `scrollIntoView` — mockear con `Element.prototype.scrollIntoView = vi.fn()`
- No probar implementación interna — probar comportamiento y output

---

## Variables de entorno

Ver `.env.example`. Para desarrollo local, crear `.env.local` (no se commitea).

| Variable                        | Uso                                               |
| ------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | URL del proyecto Supabase                         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anon (pública, safe para el cliente)        |
| `SUPABASE_SERVICE_ROLE_KEY`     | Clave service role — **solo en server**           |
| `GROQ_API_KEY`                  | API key de Groq — **solo en server**              |
| `HF_API_KEY`                    | Token de Hugging Face — **solo en server**        |

---

## Etapas de desarrollo

Ver `PLAN.md` para el detalle completo. Trabajar una etapa a la vez, con tests pasando antes de avanzar.

1. **Etapa 1** ✅ — Setup & Autenticación
2. **Etapa 2** ✅ — Upload y procesamiento de PDFs
3. **Etapa 3** ✅ — Chat con el documento (RAG)
4. **Etapa 4** — Polish & Deploy (en curso)
