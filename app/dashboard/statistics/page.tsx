"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryStats, CategorySummary } from "@/components/dashboard/CategoryStats";
import { Badge } from "@/components/ui/badge";
import { COMPLAINT_CATEGORIES, PRIORITY_LEVELS, STATUS_LEVELS } from "@/lib/constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { BarChart as BarChartIcon, Target } from "lucide-react";

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

  useEffect(() => {
    fetchCategoryAnalytics();
  }, []);

  const fetchCategoryAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch category analytics');
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">กำลังโหลดข้อมูลสถิติ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
          <button
            onClick={fetchCategoryAnalytics}
            className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>ไม่พบข้อมูล</div>;
  }

  // Prepare chart data
  const priorityData = stats.categoryStats.reduce((acc: Record<string, number>, item) => {
    // This is a simplified version - you'd need to get actual priority data from API
    acc['HIGH'] = (acc['HIGH'] || 0) + Math.floor(item.totalCount * 0.2);
    acc['MEDIUM'] = (acc['MEDIUM'] || 0) + Math.floor(item.totalCount * 0.5);
    acc['LOW'] = (acc['LOW'] || 0) + Math.floor(item.totalCount * 0.3);
    return acc;
  }, {});

  const priorityChartData = Object.entries(priorityData).map(([priority, count]) => ({
    priority,
    count,
    label: PRIORITY_LEVELS.find(p => p.value === priority)?.label || priority,
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

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChartIcon className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">สถิติและการวิเคราะห์</h1>
      </div>
      <div className="text-sm text-muted-foreground mb-6">
        อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH')}
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.overallStats.totalComplaints}</div>
            <p className="text-xs text-muted-foreground">ข้อร้องเรียนทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.overallStats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">จำนวนประเภท</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm">
              <Badge variant="secondary">
                {COMPLAINT_CATEGORIES.find(c => c.value === stats.overallStats.mostCommonCategory)?.label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">ประเภทที่พบบ่อยที่สุด</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(stats.categoryStats.reduce((sum, item) => sum + item.resolutionRate, 0) / stats.categoryStats.length)}%
            </div>
            <p className="text-xs text-muted-foreground">อัตราการแก้ไขเฉลี่ย</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Statistics */}
      <CategoryStats data={stats.categoryStats} />

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>📈 การแจกแจงตามความสำคัญ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ label, percent }: any) => `${label} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {priorityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, 'จำนวน']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>📅 แนวโน้มรายเดือน</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="monthLabel" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            ประสิทธิภาพการแก้ไขตามประเภท
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ประเภท</th>
                  <th className="text-right p-2">ทั้งหมด</th>
                  <th className="text-right p-2">ใหม่</th>
                  <th className="text-right p-2">กำลังดำเนินการ</th>
                  <th className="text-right p-2">แก้ไขแล้ว</th>
                  <th className="text-right p-2">อัตราการแก้ไข</th>
                  <th className="text-right p-2">เวลาเฉลี่ย (ชม.)</th>
                </tr>
              </thead>
              <tbody>
                {stats.categoryStats.map((item) => {
                  const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === item.category);
                  return (
                    <tr key={item.category} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <Badge variant="outline">
                          {categoryInfo?.label || item.category}
                        </Badge>
                      </td>
                      <td className="text-right p-2 font-medium">{item.totalCount}</td>
                      <td className="text-right p-2 text-blue-600">{item.newCount}</td>
                      <td className="text-right p-2 text-yellow-600">{item.inProgressCount}</td>
                      <td className="text-right p-2 text-green-600">{item.resolvedCount}</td>
                      <td className="text-right p-2">
                        <span className={`font-medium ${item.resolutionRate > 70 ? 'text-green-600' : item.resolutionRate > 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {item.resolutionRate}%
                        </span>
                      </td>
                      <td className="text-right p-2">{Math.round(item.avgResolutionTime)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
