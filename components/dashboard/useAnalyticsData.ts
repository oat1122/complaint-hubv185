import useSWR from 'swr';

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
  const fetcher = (url: string) =>
    fetch(url).then(async (res) => {
      if (!res.ok) throw new Error('Failed to fetch category analytics');
      return res.json();
    });

  const { data, isLoading, error, mutate } = useSWR<DashboardStats>(
    `/api/admin/analytics/categories?timeRange=${timeRange}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return { data, loading: isLoading, error: error ? error.message : null, refetch: mutate };
}
