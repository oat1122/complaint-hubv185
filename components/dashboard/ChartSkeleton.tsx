export function ChartSkeleton({ className = 'h-64 sm:h-80' }: { className?: string }) {
  return <div className={`loading-skeleton rounded-xl ${className}`}></div>;
}
