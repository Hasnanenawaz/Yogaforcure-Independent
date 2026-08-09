export default function LessonPlayerLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-3 w-40 bg-[#ede8e0] rounded mb-3" />

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <div className="h-3 w-24 bg-[#ede8e0] rounded mb-2" />
          <div className="h-6 w-56 bg-[#ede8e0] rounded" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-9 w-20 bg-[#ede8e0] rounded-full" />
          <div className="h-9 w-20 bg-[#ede8e0] rounded-full" />
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5 sm:gap-6">
        <div className="space-y-5 min-w-0">
          <div className="aspect-video w-full rounded-2xl bg-[#ede8e0]" />
          <div className="h-40 w-full rounded-2xl bg-[#ede8e0]" />
        </div>
        <div className="h-64 rounded-2xl bg-[#ede8e0]" />
      </div>
    </div>
  );
}
