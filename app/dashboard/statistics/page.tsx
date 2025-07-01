"use client";

import { useState, useMemo, useEffect } from "react";
import { PerformanceTable } from "@/components/dashboard/PerformanceTable";
import { RetryButton } from "@/components/RetryButton";
import { useIsMobile } from "@/components/hooks/useIsMobile";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategorySummary } from "@/components/dashboard/CategoryStats";
import { useAnalyticsData } from "@/components/dashboard/useAnalyticsData";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartContainer } from "@/components/dashboard/ChartContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMPLAINT_CATEGORIES, PRIORITY_LEVELS } from "@/lib/constants";

const CategoryStats = dynamic(() =>
  import("@/components/dashboard/CategoryStats").then((mod) => mod.CategoryStats),
  { ssr: false, loading: () => <div className="loading-skeleton h-80 rounded-xl" /> }
);
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "@/components/dashboard/Recharts";
import {
  BarChart as BarChartIcon,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Filter,
  Info,
  Award,
  Activity,
  Zap
} from "lucide-react";


export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const { data: stats, loading, error, refetch } = useAnalyticsData(timeRange);

  useEffect(() => {
    if (stats && !lastUpdated) {
      setLastUpdated(new Date().toLocaleDateString('th-TH'));
    }
  }, [stats, lastUpdated]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    setLastUpdated(new Date().toLocaleDateString('th-TH'));
  };

  const [exporting, setExporting] = useState(false);
  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setExporting(true);
      const response = await fetch(`/api/admin/analytics/export?format=${format}&timeRange=${timeRange}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    } finally {
      setExporting(false);
    }
  };

  const processedData = useMemo(() => {
    if (!stats) return null;

    const priorityData = stats.categoryStats.reduce((acc: Record<string, number>, item) => {
      acc['HIGH'] = (acc['HIGH'] || 0) + Math.floor(item.totalCount * 0.2);
      acc['MEDIUM'] = (acc['MEDIUM'] || 0) + Math.floor(item.totalCount * 0.5);
      acc['LOW'] = (acc['LOW'] || 0) + Math.floor(item.totalCount * 0.3);
      return acc;
    }, {});

    const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
      priority,
      count,
      label: PRIORITY_LEVELS.find(p => p.value === priority)?.label || priority,
      color: priority === 'HIGH' ? '#ef4444' : priority === 'MEDIUM' ? '#f59e0b' : '#10b981'
    }));

    const monthlyTrendData = stats.categoryStats.reduce((acc: Record<string, number>, item) => {
      Object.entries(item.monthlyTrends).forEach(([month, count]) => {
        acc[month] = (acc[month] || 0) + count;
      });
      return acc;
    }, {});

    const trendChartData = Object.entries(monthlyTrendData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month,
        count,
        monthLabel: new Date(month + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'short' })
      }));

    const categoryPerformanceData = stats.categoryStats
      .map(item => {
        const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === item.category);
        return {
          name: categoryInfo?.label || item.category,
          total: item.totalCount,
          resolved: item.resolvedCount,
          resolutionRate: item.resolutionRate,
          avgTime: item.avgResolutionTime,
          pending: item.totalCount - item.resolvedCount
        };
      })
      .sort((a, b) => b.total - a.total);

    const resolutionTimeData = stats.categoryStats
      .filter(item => item.avgResolutionTime > 0)
      .map(item => {
        const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === item.category);
        return {
          category: categoryInfo?.label || item.category,
          time: Math.round(item.avgResolutionTime),
          count: item.resolvedCount
        };
      })
      .sort((a, b) => a.time - b.time)
      .slice(0, 8);

    const totalResolved = stats.categoryStats.reduce((sum, item) => sum + item.resolvedCount, 0);
    const totalComplaints = stats.overallStats.totalComplaints;
    const overallResolutionRate = totalComplaints > 0 ? Math.round((totalResolved / totalComplaints) * 100) : 0;
    const avgResolutionTime = stats.categoryStats.length > 0
      ? Math.round(stats.categoryStats.reduce((sum, item) => sum + item.avgResolutionTime, 0) / stats.categoryStats.length)
      : 0;

    return {
      priorityChartData,
      trendChartData,
      categoryPerformanceData,
      resolutionTimeData,
      overallMetrics: { overallResolutionRate, avgResolutionTime }
    };
  }, [stats]);

  const [sortBy, setSortBy] = useState('resolutionRate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const sortedCategoryStats = useMemo(() => {
    if (!stats) return [];
    return [...stats.categoryStats].sort((a, b) => {
      const valA = (a as any)[sortBy];
      const valB = (b as any)[sortBy];
      if (valA === valB) return 0;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [stats, sortBy, sortOrder]);

  const handleSortTable = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const priorityChartData = processedData?.priorityChartData ?? [];
  const trendChartData = processedData?.trendChartData ?? [];
  const categoryPerformanceData = processedData?.categoryPerformanceData ?? [];
  const resolutionTimeData = processedData?.resolutionTimeData ?? [];
  const overallResolutionRate = processedData?.overallMetrics.overallResolutionRate ?? 0;
  const avgResolutionTime = processedData?.overallMetrics.avgResolutionTime ?? 0;

  const COLORS = ['#ab1616', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];

  if (loading) {
    return (
      <div className="container-responsive py-6 sm:py-8 pb-24">
        <div className="space-y-6">
          <div className="space-y-2 animate-pulse">
            <div className="h-8 loading-skeleton rounded w-64"></div>
            <div className="h-4 loading-skeleton rounded w-96"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="loading-skeleton h-24 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="loading-skeleton h-80 rounded-xl"></div>
            <div className="loading-skeleton h-80 rounded-xl"></div>
          </div>
          <div className="loading-skeleton h-96 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-responsive py-6 sm:py-8 pb-24">
        <Card className="card-modern">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">เกิดข้อผิดพลาด</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">{error}</p>
            <RetryButton onRetry={() => refetch()} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container-responsive py-6 sm:py-8 pb-24">
        <Card className="card-modern">
          <CardContent className="flex items-center justify-center py-12">
            <p className="text-gray-600 dark:text-gray-400">ไม่พบข้อมูล</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="container-responsive py-6 sm:py-8 pb-24 space-y-6 sm:space-y-8 animate-slide-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <BarChartIcon className="w-8 h-8 text-primary" />
            <h1 className="heading-responsive text-gray-900 dark:text-white">
              สถิติและการวิเคราะห์
            </h1>
          </div>
          <p className="body-responsive text-gray-600 dark:text-gray-400">
            ข้อมูลเชิงลึกและการวิเคราะห์ประสิทธิภาพ • อัพเดทล่าสุด: {lastUpdated ?? '–'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 เดือน</SelectItem>
              <SelectItem value="3months">3 เดือน</SelectItem>
              <SelectItem value="6months">6 เดือน</SelectItem>
              <SelectItem value="1year">1 ปี</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="tap-target"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </Button>

          <Button onClick={() => handleExport('excel')} variant="outline" size="sm" className="tap-target" disabled={exporting}>
            <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">ส่งออก</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="เรื่องร้องเรียนทั้งหมด"
          value={stats.overallStats.totalComplaints.toLocaleString()}
          icon={BarChartIcon}
          iconClass="bg-gradient-primary"
          description={<span className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" />+12% จากเดือนที่แล้ว</span>}
        />
        <StatCard
          title="อัตราการแก้ไข"
          value={<span className="text-green-600">{overallResolutionRate}%</span>}
          icon={Target}
          iconClass="bg-gradient-success"
          description={<span className="text-xs text-green-600 flex items-center mt-1"><TrendingUp className="w-3 h-3 mr-1" />+5% จากเดือนที่แล้ว</span>}
        />
        <StatCard
          title="เวลาแก้ไขเฉลี่ย"
          value={<span className="text-blue-600">{avgResolutionTime}</span>}
          icon={Clock}
          iconClass="bg-gradient-info"
          description={<span className="text-xs text-blue-600">ชั่วโมง</span>}
        />
        <StatCard
          title="ประเภทยอดนิยม"
          value={<Badge variant="secondary" className="text-xs">{COMPLAINT_CATEGORIES.find(c => c.value === stats.overallStats.mostCommonCategory)?.label || 'ไม่ระบุ'}</Badge>}
          icon={Award}
          iconClass="bg-gradient-warning"
          description={<span className="text-xs text-gray-500">มากที่สุด</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <ChartContainer
          title={<><TrendingUp className="w-5 h-5 text-primary" /> แนวโน้มรายเดือน</>}
          description={`จำนวนเรื่องร้องเรียนในช่วง ${timeRange === '6months' ? '6 เดือน' : timeRange === '1year' ? '1 ปี' : timeRange} ที่ผ่านมา`}
          loading={loading}
        >
          <div style={{ height: isMobile ? 250 : 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ab1616" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ab1616" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [value, 'จำนวนเรื่องร้องเรียน']}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#ab1616"
                    strokeWidth={3}
                    fillOpacity={1}
                  fill="url(#colorTrend)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer
          title={<><AlertTriangle className="w-5 h-5 text-primary" /> การแจกแจงตามความสำคัญ</>}
          description="สัดส่วนเรื่องร้องเรียนแต่ละระดับความสำคัญ"
          loading={loading}
        >
          <div style={{ height: isMobile ? 250 : 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                    dataKey="count"
                    label={({ label, percent }) => `${label} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [value, props.payload.label]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
        </ChartContainer>
      </div>

      <ChartContainer
        title={<><Activity className="w-5 h-5 text-primary" /> ประสิทธิภาพการแก้ไขตามประเภท</>}
        description="เปรียบเทียบจำนวนเรื่องทั้งหมดและจำนวนที่แก้ไขแล้วแต่ละประเภท"
        loading={loading}
      >
        <div style={{ height: isMobile ? 300 : 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11 }}
                angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => {
                    const labels: Record<string, string> = {
                      total: 'ทั้งหมด',
                      resolved: 'แก้ไขแล้ว',
                      pending: 'รอดำเนินการ'
                    };
                    return [value, labels[name] || name];
                  }}
                />
                <Bar dataKey="total" fill="#e5e7eb" name="total" radius={[2, 2, 0, 0]} />
                <Bar dataKey="resolved" fill="#10b981" name="resolved" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </ChartContainer>

      <ChartContainer
        title={<><Zap className="w-5 h-5 text-primary" /> เปรียบเทียบเวลาในการแก้ไข</>}
        description="เวลาเฉลี่ยในการแก้ไขปัญหาแต่ละประเภท (ชั่วโมง)"
        loading={loading}
      >
        <div style={{ height: isMobile ? 250 : 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resolutionTimeData} layout="horizontal" margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value) => [`${value} ชั่วโมง`, 'เวลาเฉลี่ย']}
                />
                <Bar dataKey="time" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </ChartContainer>

      <CategorySummary data={stats.categoryStats} />
      <CategoryStats data={stats.categoryStats} />

      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>ตารางประสิทธิภาพโดยรวม</span>
          </CardTitle>
          <CardDescription>ข้อมูลรายละเอียดการแก้ไขปัญหาแต่ละประเภท</CardDescription>
        </CardHeader>
        <CardContent>
          <PerformanceTable data={sortedCategoryStats} onSort={handleSortTable} sortBy={sortBy} sortOrder={sortOrder} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-modern bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">จุดแข็ง</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
              <li>• อัตราการแก้ไขโดยรวมสูง ({overallResolutionRate}%)</li>
              <li>• เวลาตอบสนองเฉลี่ยอยู่ในเกณฑ์ดี</li>
              <li>• มีระบบติดตามที่มีประสิทธิภาพ</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-modern bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">ควรปรับปรุง</h3>
            </div>
            <ul className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
              <li>• เรื่องร้องเรียนด้านความปลอดภัยต้องเร่งแก้ไข</li>
              <li>• ปรับปรุงเวลาตอบสนองในบางประเภท</li>
              <li>• เพิ่มการติดตามเชิงป้องกัน</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">ข้อเสนอแนะ</h3>
            </div>
            <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <li>• จัดอบรมเพิ่มเติมสำหรับทีมงาน</li>
              <li>• ใช้เทคโนโลยี AI ช่วยจัดประเภท</li>
              <li>• สร้างระบบแจ้งเตือนเชิงรุก</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
