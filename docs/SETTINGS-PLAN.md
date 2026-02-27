# Plan: Página de Configuración de Usuario

## Contexto

La app doc-qa no tiene forma de que el usuario edite su perfil (nombre, avatar, contraseña). Se necesita una página `/settings` básica que permita cambiar nombre, avatar y contraseña, y que muestre info de la cuenta como solo lectura. Debe seguir la estética "Editorial Dark" existente y reutilizar el patrón de layout con ChatSidebar.

---

## Archivos a crear

| Archivo | Descripción |
|---------|-------------|
| `app/settings/layout.tsx` | Server Component — mismo patrón que `app/new/layout.tsx` (auth + ChatSidebar) |
| `app/settings/page.tsx` | `'use client'` — formularios de perfil, seguridad e info de cuenta |
| `app/api/settings/avatar/route.ts` | POST — upload de avatar a Supabase Storage, actualiza `user_metadata.avatar_url` |
| `__tests__/components/settings/SettingsPage.test.tsx` | Tests del componente settings |

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `proxy.ts` | Agregar `'/settings'` a rutas protegidas |
| `components/layout/ChatSidebar.tsx` | Agregar link "Configuración" en dropdown del usuario + soporte para avatar image + extender tipo `UserInfo` con `avatarUrl` |
| `app/layout.tsx` | Agregar `<Toaster />` de sonner para notificaciones toast |
| `app/new/layout.tsx` | Pasar `avatarUrl` en `userInfo` |
| `app/documents/layout.tsx` | Pasar `avatarUrl` en `userInfo` |

## Dependencias

- Instalar `sonner` via `npx shadcn@latest add sonner`

## Supabase

- Crear bucket **público** `avatars` (2MB max, JPEG/PNG/WebP/GIF)
- RLS: SELECT público, INSERT/DELETE solo al dueño (`auth.uid()`)

---

## Pasos de implementación

### 1. Instalar sonner + agregar Toaster al root layout
- `npx shadcn@latest add sonner`
- En `app/layout.tsx`: importar `Toaster` de `@/components/ui/sonner`, renderizar después de `{children}`

### 2. Proteger ruta `/settings`
- En `proxy.ts`: agregar `'/settings'` al array de rutas protegidas

### 3. Crear layout de settings
- `app/settings/layout.tsx` — copia del patrón de `app/new/layout.tsx`
- Usa `overflow-y-auto` en main (el contenido puede ser largo)

### 4. Crear página de settings (`'use client'`)
Tres secciones independientes:

**Perfil** — Avatar clickeable (abre file input oculto) + input de nombre + botón guardar
- Avatar: usa `Avatar`/`AvatarImage`/`AvatarFallback`, overlay con ícono de cámara en hover
- Nombre: `supabase.auth.updateUser({ data: { full_name } })` desde el browser client
- `router.refresh()` después de cada cambio para actualizar el sidebar

**Seguridad** — Contraseña nueva + confirmar + botón guardar
- Validación: mínimo 6 chars, ambos campos deben coincidir
- `supabase.auth.updateUser({ password })` desde el browser client

**Info de cuenta** (solo lectura) — Email, fecha de creación, ID de usuario

Estilo: misma estética que las auth pages (Young Serif para título, labels uppercase tracking-wider, inputs con focus border #58a6ff, botones azules). Contenedor `max-w-2xl mx-auto`.

### 5. Crear API route para avatar
- `app/api/settings/avatar/route.ts`
- Valida auth, tipo de archivo (JPEG/PNG/WebP/GIF), tamaño (≤2MB)
- Borra avatar anterior si existe
- Sube a bucket `avatars` con path `{user_id}/{timestamp}-avatar.{ext}`
- Actualiza `user_metadata.avatar_url` con la URL pública
- Retorna `{ avatarUrl }` con status 200

### 6. Actualizar ChatSidebar
- Extender tipo `UserInfo` con `avatarUrl: string | null`
- Importar `AvatarImage` y mostrar avatar del usuario donde corresponda
- Agregar `<DropdownMenuItem>` con link a `/settings` (ícono Settings) antes del logout
- Actualizar los 3 layouts para pasar `avatarUrl` en `userInfo`

### 7. Crear bucket `avatars` en Supabase
- Bucket público, 2MB max, solo imágenes
- Policies RLS para INSERT/DELETE restringidas al dueño

### 8. Tests
- Mock de `supabase.auth.getUser()` con datos de prueba
- Verificar que las 3 secciones renderizan
- Test de cambio de nombre llama `updateUser` correctamente
- Test de validación de contraseña (mismatch, muy corta)
- Test de campos read-only muestran valores correctos

---

## Verificación

1. `npm run test:run` — todos los tests pasan
2. `npm run build` — build sin errores
3. Manual: navegar a `/settings`, cambiar nombre → sidebar se actualiza, cambiar contraseña → toast de éxito, subir avatar → se muestra en settings y sidebar, info read-only visible
