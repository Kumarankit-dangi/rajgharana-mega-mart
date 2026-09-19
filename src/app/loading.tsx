export default function Loading() {
  return (
    <div className="container-x py-10 sm:py-14" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="skeleton animate-shimmer h-3.5 w-24 rounded-full" />
      <div className="skeleton animate-shimmer mt-4 h-10 w-2/3 max-w-md rounded-2xl" />
      <div className="skeleton animate-shimmer mt-3 h-4 w-1/2 max-w-sm rounded-full" />
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl bg-white ring-1 ring-gold-200/50">
            <div className="skeleton animate-shimmer aspect-[3/4]" />
            <div className="space-y-2.5 p-4">
              <div className="skeleton animate-shimmer h-3 w-1/3 rounded-full" />
              <div className="skeleton animate-shimmer h-4 w-4/5 rounded-full" />
              <div className="skeleton animate-shimmer h-4 w-1/2 rounded-full" />
              <div className="skeleton animate-shimmer mt-4 h-11 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
