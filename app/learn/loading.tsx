export default function LearnDashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-64 bg-[#ede8e0] rounded-lg mb-2" />
      <div className="h-4 w-48 bg-[#ede8e0] rounded-lg mb-8" />

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#ede8e0] p-5 flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-[#ede8e0] shrink-0" />
            <div className="flex-1">
              <div className="h-5 w-10 bg-[#ede8e0] rounded mb-2" />
              <div className="h-3 w-20 bg-[#ede8e0] rounded" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#faf8f5] rounded-2xl border border-[#ede8e0]/80 p-4 sm:p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-[#ede8e0] shrink-0" />
          <div className="flex-1">
            <div className="h-4 w-40 bg-[#ede8e0] rounded mb-2" />
            <div className="h-3 w-28 bg-[#ede8e0] rounded" />
          </div>
        </div>
        <div className="h-2 rounded-full bg-[#ede8e0] mb-4" />
        <div className="h-11 w-full bg-[#ede8e0] rounded-full" />
      </div>
    </div>
  );
}
