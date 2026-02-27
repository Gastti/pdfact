# Document Q&A — Plan de desarrollo

## Stack definido

| Capa                | Tecnología                | Por qué                                           |
| ------------------- | ------------------------- | ------------------------------------------------- |
| Framework           | Next.js 14+ (App Router)  | Full-stack, SSR, API routes, ideal para portfolio |
| Lenguaje            | TypeScript                | Tipado, más profesional                           |
| UI                  | Tailwind CSS + shadcn/ui  | Rápido, componentes accesibles y prolijos         |
| Auth + DB + Storage | Supabase                  | Free tier generoso, pgvector incluido, auth listo |
| LLM                 | Google Gemini 1.5 Flash   | Free tier: 15 req/min, 1M tokens/day              |
| Embeddings          | Google text-embedding-004 | Incluido en el mismo SDK de Gemini                |
| Vector Search       | Supabase pgvector         | Extensión nativa de PostgreSQL                    |
| PDF Parsing         | pdfjs-dist                | Extrae texto de PDFs sin backend externo          |
| Testing             | Vitest + Testing Library  | Unit/integration tests                            |
| Deploy              | Vercel                    | Free tier, integración nativa con Next.js         |

---

## Arquitectura general (RAG)

```
[Usuario sube PDF]
       ↓
[Extraer texto del PDF]
       ↓
[Dividir en chunks (~500 tokens)]
       ↓
[Generar embedding por chunk → Gemini]
       ↓
[Guardar chunks + embeddings → Supabase pgvector]

[Usuario hace una pregunta]
       ↓
[Generar embedding de la pregunta]
       ↓
[Buscar chunks similares → pgvector]
       ↓
[Armar prompt con contexto + pregunta]
       ↓
[Gemini genera respuesta con citas]
       ↓
[Mostrar respuesta en el chat]
```

---

## Etapas de desarrollo

---

### Etapa 1 — Setup & Autenticación

**Objetivo:** Proyecto corriendo con login funcional.

**Tareas:**

- [ ] Inicializar Next.js con TypeScript y Tailwind
- [ ] Instalar shadcn/ui y configurar tema
- [ ] Crear proyecto en Supabase (configurar variables de entorno)
- [ ] Habilitar Auth de Supabase (email + password)
- [ ] Páginas: `/login`, `/register`, `/dashboard` (protegida)
- [ ] Middleware de protección de rutas
- [ ] Layout base de la app (sidebar + header)

**Tests:**

- Renders de página de login y registro
- Redirección a dashboard si ya hay sesión
- Redirección a login si no hay sesión (middleware)

---

### Etapa 2 — Upload y procesamiento de documentos

**Objetivo:** El usuario puede subir un PDF y queda procesado en la DB.

**Tareas:**

- [ ] Tabla `documents` en Supabase (id, user_id, name, created_at)
- [ ] Tabla `chunks` en Supabase con columna `embedding vector(768)`
- [ ] Habilitar extensión pgvector en Supabase
- [ ] UI de upload (drag & drop o input de archivo)
- [ ] API route `POST /api/documents` que:
  - Sube el PDF a Supabase Storage
  - Extrae el texto con pdfjs-dist
  - Divide el texto en chunks
  - Genera embeddings con Gemini
  - Guarda chunks + embeddings en la DB
- [ ] Estado de progreso en el UI (subiendo, procesando, listo)
- [ ] Lista de documentos subidos en el dashboard

**Tests:**

- Función de chunking: texto largo → array de chunks esperados
- API route: mock del embedding y verificar que se guarda en DB
- Render de la lista de documentos

---

### Etapa 3 — Chat con el documento

**Objetivo:** El usuario puede hacer preguntas y recibe respuestas con citas.

**Tareas:**

- [ ] Tabla `conversations` y `messages` en Supabase
- [ ] Página `/documents/[id]/chat`
- [ ] Función de búsqueda vectorial en Supabase (SQL function con pgvector)
- [ ] API route `POST /api/chat` que:
  - Genera embedding de la pregunta
  - Busca los N chunks más similares (cosine similarity)
  - Arma prompt: sistema + contexto + pregunta
  - Llama a Gemini y hace streaming de la respuesta
  - Pide a Gemini que cite el número de chunk fuente
- [ ] UI de chat (burbuja usuario / burbuja AI)
- [ ] Mostrar citas como referencias clickeables
- [ ] Streaming de respuesta (typewriter effect)

**Tests:**

- Función de búsqueda vectorial: mock de Supabase, verificar query
- API route: mock de Gemini, verificar que el prompt incluye el contexto
- Render del componente de chat con mensajes

---

### Etapa 4 — Polish & Deploy

**Objetivo:** App lista para mostrar en portfolio.

**Tareas:**

- [ ] Manejo de errores global (archivos inválidos, límites de API, etc.)
- [ ] Estados de carga en toda la app (skeletons, spinners)
- [ ] Eliminar documentos (con sus chunks y archivo en Storage)
- [ ] Límite de tamaño de archivo (ej: 10MB max)
- [ ] Solo acepta PDFs (validación client + server)
- [ ] README con instrucciones de setup y descripción del proyecto
- [ ] Variables de entorno documentadas en `.env.example`
- [ ] Deploy en Vercel
- [ ] Test de integración: flujo completo upload → pregunta → respuesta (mock de APIs externas)

---

## Estructura de carpetas (target)

```
doc-qa/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── documents/
│   │   └── [id]/
│   │       └── chat/
│   ├── api/
│   │   ├── documents/
│   │   └── chat/
│   └── layout.tsx
├── components/
│   ├── ui/          ← shadcn components
│   ├── chat/
│   ├── documents/
│   └── layout/
├── lib/
│   ├── supabase/    ← client, server, middleware
│   ├── gemini/      ← embeddings, chat
│   └── pdf/         ← parsing, chunking
├── __tests__/
├── .env.example
└── PLAN.md
```

---

## Variables de entorno necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

---

## Orden de trabajo sugerido

Trabajar etapa por etapa, en orden. Cada etapa termina con los tests pasando.
No avanzar a la siguiente hasta que la anterior esté completa y estable.
