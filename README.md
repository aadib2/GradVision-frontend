# GradVision Frontend

Frontend for the GradVision web application.

Built with:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

## Getting Started

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Loading, error and empty states

Shared pieces live in `src/components/states/`:

| Situation | Use |
| --- | --- |
| Something is loading | `<Skeleton />`, `<ListSkeleton />`, `<PageSkeleton />`, or `<Spinner />` (inside buttons) |
| A request failed (client component) | `<ErrorState message={...} onRetry={...} />` |
| Form error (login, signup) | `<FormError message={error} />` |
| Nothing to show yet | `<EmptyState text="..." href="/explore" linkLabel="..." />` |

Next.js also shows these automatically:

- `src/app/(application)/loading.tsx`: skeleton while an app page loads
- `src/app/(application)/dashboard/loading.tsx`: skeleton shaped like the dashboard
- `src/app/(application)/error.tsx` and `src/app/error.tsx`: friendly message if a page crashes
- `src/app/not-found.tsx`: 404 page

To preview the dashboard without logging in or running the backend, add
`NEXT_PUBLIC_USE_SAMPLE_DATA=true` to `.env.local`.
