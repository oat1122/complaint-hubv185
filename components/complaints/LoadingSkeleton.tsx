import React from 'react';

export function LoadingSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="loading-skeleton h-32 rounded-xl" />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
