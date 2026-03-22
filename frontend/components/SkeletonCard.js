export default function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-5 border border-white/6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-20 rounded" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-4/5 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-5 w-14 rounded-md" />
        <div className="skeleton h-5 w-14 rounded-md" />
      </div>
      <div className="flex justify-end pt-1 border-t border-white/5">
        <div className="skeleton h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}
