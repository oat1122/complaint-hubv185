export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="loading-skeleton h-32 rounded-xl"></div>
      ))}
    </div>
  );
}
