import { useState, useEffect, useCallback, useRef } from 'react';

export interface DashboardStats {
  overallStats: {
    totalComplaints: number;
    totalCategories: number;
    mostCommonCategory: string;
    leastCommonCategory: string;
  };
  categoryStats: Array<{
    category: string;
    totalCount: number;
    newCount: number;
    inProgressCount: number;
    resolvedCount: number;
    closedCount: number;
    archivedCount: number;
    avgResolutionTime: number;
    resolutionRate: number;
    monthlyTrends: Record<string, number>;
  }>;
}

export function useAnalyticsData(timeRange: string) {
  const cacheRef = useRef<Record<string, DashboardStats>>({});
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const cached = cacheRef.current[timeRange];
      if (cached) {
        setData(cached);
        return;
      }
      const response = await fetch(`/api/admin/analytics/categories?range=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category analytics');
      }
      const result = (await response.json()) as DashboardStats;
      setData(result);
      cacheRef.current[timeRange] = result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
