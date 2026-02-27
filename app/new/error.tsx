'use client'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function DashboardError({ error, reset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <h2 className="text-lg font-semibold">Algo salió mal</h2>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {error.message || 'Ocurrió un error al cargar tus documentos.'}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand/90"
      >
        Reintentar
      </button>
    </div>
  )
}
