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

Shared pieces live in `src/components/states/`. Use them on every page that loads data:

| Situation | Use |
| --- | --- |
| Data is loading | `<ListSkeleton />`, `<PageSkeleton />`, or `<Spinner />` (for buttons) |
| API call failed | `<ErrorState message={...} onRetry={reload} />` |
| Form error (login, signup) | `<FormError message={error} />` |
| Nothing to show yet | `<EmptyState text="..." href="/explore" linkLabel="..." />` |

`useApi` (in `src/hooks/use-api.ts`) handles loading and errors for you:

```tsx
const fetchPrograms = () => api.get("/programs/").then((r) => r.data);

export default function ExplorePage() {
  const { state, reload } = useApi(fetchPrograms);

  if (state.status === "loading") return <ListSkeleton />;
  if (state.status === "error") return <ErrorState message={state.error} onRetry={reload} />;
  if (state.data.length === 0) return <EmptyState text="No programs found." />;
  return <ProgramList programs={state.data} />;
}
```

Next.js also shows these automatically:

- `src/app/(application)/loading.tsx`: skeleton while an app page loads
- `src/app/(application)/error.tsx` and `src/app/error.tsx`: friendly message if a page crashes
- `src/app/not-found.tsx`: 404 page

To preview the dashboard without the backend, run with `NEXT_PUBLIC_USE_SAMPLE_DATA=true`.
