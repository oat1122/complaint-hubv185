import useSWR from 'swr'

export interface CategoryStat {
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
}

export interface AnalyticsData {
  overallStats: {
    totalComplaints: number;
    totalCategories: number;
    mostCommonCategory: string;
    leastCommonCategory: string;
  };
  categoryStats: CategoryStat[];
  timestamp: string;
}

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('Failed to fetch')
  }
  return res.json()
}

export function useAnalyticsData(timeRange: string) {
  const { data, error, isLoading, mutate } = useSWR<AnalyticsData>(
    `/api/admin/analytics/categories?range=${timeRange}`,
    fetcher,
    {
      dedupingInterval: 5 * 60 * 1000,
    }
  )

  return {
    data,
    error: error ? (error as Error).message : null,
    loading: isLoading,
    refetch: mutate,
  }
}
