"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CategorySummary } from "@/components/dashboard/CategoryStats";
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
import { toast } from "sonner";

interface DashboardStats {
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

export default function StatisticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('6months');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchCategoryAnalytics();
  }, [timeRange]);

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString('th-TH'));
  }, []);


  const fetchCategoryAnalytics = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      const response = await fetch(`/api/admin/analytics/categories?timeRange=${timeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch category analytics');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCategoryAnalytics();
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      setExporting(true);
      const res = await fetch(`/api/admin/analytics/export?format=${format}&timeRange=${timeRange}`);
      if (!res.ok) {
        throw new Error('ไม่สามารถส่งออกได้');
      }
      const blob = await res.blob();
      const ext = format === 'pdf' ? 'pdf' : 'xlsx';
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 100);
      toast.success('ส่งออกสำเร็จ');
    } catch (err: any) {
      toast.error(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setExporting(false);
    }
  };

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
            <Button onClick={fetchCategoryAnalytics} className="tap-target">
              <RefreshCw className="w-4 h-4 mr-2" />
              ลองใหม่
            </Button>
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
      monthLabel: new Date(month + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'short' }),
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

  const COLORS = ['#ab1616', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16'];


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

          <Button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            variant="outline"
            size="sm"
            className="tap-target"
          >
            <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">ส่งออก</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="card-modern">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">เรื่องร้องเรียนทั้งหมด</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {stats.overallStats.totalComplaints.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% จากเดือนที่แล้ว
                </p>
              </div>
              <div className="p-3 bg-gradient-primary rounded-xl">
                <BarChartIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">อัตราการแก้ไข</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {overallResolutionRate}%
                </p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +5% จากเดือนที่แล้ว
                </p>
              </div>
              <div className="p-3 bg-gradient-success rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">เวลาแก้ไขเฉลี่ย</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {avgResolutionTime}
                </p>
                <p className="text-xs text-blue-600">ชั่วโมง</p>
              </div>
              <div className="p-3 bg-gradient-info rounded-xl">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ประเภทยอดนิยม</p>
                <div className="mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {COMPLAINT_CATEGORIES.find(c => c.value === stats.overallStats.mostCommonCategory)?.label || 'ไม่ระบุ'}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-1">มากที่สุด</p>
              </div>
              <div className="p-3 bg-gradient-warning rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>แนวโน้มรายเดือน</span>
            </CardTitle>
            <CardDescription>จำนวนเรื่องร้องเรียนในช่วง {timeRange === '6months' ? '6 เดือน' : timeRange === '1year' ? '1 ปี' : timeRange} ที่ผ่านมา</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
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
          </CardContent>
        </Card>

        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <span>การแจกแจงตามความสำคัญ</span>
            </CardTitle>
            <CardDescription>สัดส่วนเรื่องร้องเรียนแต่ละระดับความสำคัญ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
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
          </CardContent>
        </Card>
      </div>

      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>ประสิทธิภาพการแก้ไขตามประเภท</span>
          </CardTitle>
          <CardDescription>เปรียบเทียบจำนวนเรื่องทั้งหมดและจำนวนที่แก้ไขแล้วแต่ละประเภท</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 sm:h-96">
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
        </CardContent>
      </Card>

      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>เปรียบเทียบเวลาในการแก้ไข</span>
          </CardTitle>
          <CardDescription>เวลาเฉลี่ยในการแก้ไขปัญหาแต่ละประเภท (ชั่วโมง)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
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
        </CardContent>
      </Card>

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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-3 font-medium">ประเภท</th>
                  <th className="text-right p-3 font-medium">ทั้งหมด</th>
                  <th className="text-right p-3 font-medium">ใหม่</th>
                  <th className="text-right p-3 font-medium">กำลังดำเนินการ</th>
                  <th className="text-right p-3 font-medium">แก้ไขแล้ว</th>
                  <th className="text-right p-3 font-medium">อัตราการแก้ไข</th>
                  <th className="text-right p-3 font-medium">เวลาเฉลี่ย (ชม.)</th>
                  <th className="text-center p-3 font-medium">ประสิทธิภาพ</th>
                </tr>
              </thead>
              <tbody>
                {stats.categoryStats
                  .sort((a, b) => b.resolutionRate - a.resolutionRate)
                  .map((item) => {
                    const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === item.category);
                    const performanceScore = Math.round((item.resolutionRate + (100 - Math.min(item.avgResolutionTime / 24 * 100, 100))) / 2);

                    return (
                      <tr key={item.category} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {categoryInfo && <categoryInfo.icon className="w-4 h-4" />}
                            <span className="font-medium">{categoryInfo?.label || item.category}</span>
                          </div>
                        </td>
                        <td className="text-right p-3 font-semibold">{item.totalCount}</td>
                        <td className="text-right p-3 text-blue-600">{item.newCount}</td>
                        <td className="text-right p-3 text-yellow-600">{item.inProgressCount}</td>
                        <td className="text-right p-3 text-green-600">{item.resolvedCount}</td>
                        <td className="text-right p-3">
                          <span className={`font-semibold ${
                            item.resolutionRate > 80 ? 'text-green-600' :
                            item.resolutionRate > 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {item.resolutionRate}%
                          </span>
                        </td>
                        <td className="text-right p-3">
                          <span className={`${
                            item.avgResolutionTime < 24 ? 'text-green-600' :
                            item.avgResolutionTime < 72 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round(item.avgResolutionTime)}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <div className="flex items-center justify-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              performanceScore > 80 ? 'bg-green-500' :
                              performanceScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}>
                              {performanceScore}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
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
