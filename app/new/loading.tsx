export default function NewLoading() {
	return (
		<div className="flex h-full flex-col items-center justify-center px-4 sm:px-6">
			<div className="w-full max-w-md">
				{/* Header placeholder */}
				<div className="text-center">
					<div className="mx-auto mb-6 h-16 w-16 animate-pulse rounded-2xl border border-border/60 bg-card" />
					<div className="mx-auto h-6 w-32 animate-pulse rounded-md bg-muted" />
					<div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded-md bg-muted/60" />
				</div>

				{/* UploadArea skeleton */}
				<div className="mt-8 rounded-xl border border-dashed border-border/60">
					<div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:py-7">
						<div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-secondary" />
						<div className="min-w-0 sm:flex-1">
							<div className="h-4 w-48 animate-pulse rounded-md bg-muted" />
							<div className="mt-1.5 h-3 w-32 animate-pulse rounded-md bg-muted/60" />
						</div>
						<div className="h-9 w-28 animate-pulse rounded-md bg-secondary sm:shrink-0" />
					</div>
				</div>
			</div>
		</div>
	)
}
