"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  Bell,
  Eye,
  Calendar,
  Target,
  Zap
} from "lucide-react";
import Link from "next/link";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "@/components/dashboard/Recharts";

interface DashboardStats {
  totalComplaints: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  closedComplaints: number;
  archivedComplaints: number;
  avgResponseTime: number;
  todayComplaints: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  priorityBreakdown: Array<{
    priority: string;
    count: number;
  }>;
  monthlyTrends: Record<string, number>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalComplaints: 0,
    newComplaints: 0,
    inProgressComplaints: 0,
    resolvedComplaints: 0,
    closedComplaints: 0,
    archivedComplaints: 0,
    avgResponseTime: 0,
    todayComplaints: 0,
    categoryBreakdown: [],
    priorityBreakdown: [],
    monthlyTrends: {},
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
    
    // Update time every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      console.log('Fetching dashboard stats...');
      const response = await fetch('/api/dashboard/stats', {
        credentials: 'include',
      });
      
      console.log('Dashboard stats response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Dashboard stats data:', data);
        setStats(data);
      } else {
        const errorData = await response.json();
        console.error('Dashboard stats error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Prepare chart data
  const monthlyData = Object.entries(stats.monthlyTrends)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, count]) => ({
      month: new Date(month + '-01').toLocaleDateString('th-TH', { month: 'short' }),
      count,
      fullMonth: month
    }));

  const categoryData = stats.categoryBreakdown.map(item => ({
    name: item.category,
    value: item.count,
    displayName: getCategoryDisplayName(item.category)
  }));

  const priorityData = stats.priorityBreakdown.map(item => ({
    name: item.priority,
    value: item.count,
    displayName: getPriorityDisplayName(item.priority)
  }));

  // Calculate resolution rate
  const resolutionRate = stats.totalComplaints > 0 
    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
    : 0;

  const statCards = [
    {
      title: "เรื่องร้องเรียนทั้งหมด",
      value: stats.totalComplaints,
      icon: MessageSquare,
      gradient: "from-[#ab1616] to-[#750c0c]",
      change: { value: 12, type: 'increase' as const },
      description: "เพิ่มขึ้นจากเดือนที่แล้ว",
      href: "/dashboard/complaints"
    },
    {
      title: "เรื่องใหม่",
      value: stats.newComplaints,
      icon: Bell,
      gradient: "from-orange-500 to-red-500",
      change: { value: 5, type: 'increase' as const },
      description: "รอการตรวจสอบ",
      href: "/dashboard/complaints?status=NEW"
    },
    {
      title: "กำลังดำเนินการ",
      value: stats.inProgressComplaints,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
      change: { value: 3, type: 'decrease' as const },
      description: "อยู่ในขั้นตอนแก้ไข",
      href: "/dashboard/complaints?status=IN_PROGRESS"
    },
    {
      title: "แก้ไขแล้ว",
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      change: { value: 18, type: 'increase' as const },
      description: "สำเร็จในเดือนนี้",
      href: "/dashboard/complaints?status=RESOLVED"
    },
  ];

  const quickActions = [
    {
      title: "ตรวจสอบเรื่องใหม่",
      description: "เรื่องร้องเรียนที่รอการตรวจสอบ",
      href: "/dashboard/complaints?status=NEW",
      count: stats.newComplaints,
      countColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-500"
    },
    {
      title: "ติดตามความคืบหน้า",
      description: "เรื่องร้องเรียนที่กำลังดำเนินการ",
      href: "/dashboard/complaints?status=IN_PROGRESS",
      count: stats.inProgressComplaints,
      countColor: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      icon: Activity,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "ดูรายงานสถิติ",
      description: "สถิติและกราฟแสดงผลการดำเนินงาน",
      href: "/dashboard/statistics",
      count: 0,
      countColor: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
      icon: BarChart3,
      gradient: "from-[#ab1616] to-[#750c0c]"
    }
  ];

  // Chart colors
  const COLORS = ['#ab1616', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  function getCategoryDisplayName(category: string) {
    const categoryMap: Record<string, string> = {
      'TECHNICAL': 'เทคนิค',
      'PERSONNEL': 'บุคคล',
      'ENVIRONMENT': 'สภาพแวดล้อม',
      'EQUIPMENT': 'อุปกรณ์',
      'SAFETY': 'ความปลอดภัย',
      'FINANCIAL': 'การเงิน',
      'STRUCTURE_SYSTEM': 'โครงสร้าง',
      'WELFARE_SERVICES': 'สวัสดิการ',
      'PROJECT_IDEA': 'ไอเดีย',
      'OTHER': 'อื่นๆ'
    };
    return categoryMap[category] || category;
  }

  function getPriorityDisplayName(priority: string) {
    const priorityMap: Record<string, string> = {
      'LOW': 'ต่ำ',
      'MEDIUM': 'ปานกลาง',
      'HIGH': 'สูง',
      'URGENT': 'เร่งด่วน'
    };
    return priorityMap[priority] || priority;
  }

  if (loading) {
    return (
      <div className="container-responsive py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="h-8 loading-skeleton rounded w-64"></div>
          <div className="h-4 loading-skeleton rounded w-96"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="loading-skeleton h-32 rounded-xl"></div>
          ))}
        </div>
        
        {/* Quick actions skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="loading-skeleton h-40 rounded-xl"></div>
          ))}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="loading-skeleton h-80 rounded-xl"></div>
          <div className="loading-skeleton h-80 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-6 sm:py-8 space-y-6 sm:space-y-8 animate-slide-in">
      {/* Enhanced Header - Mobile Optimized */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="space-y-2">
          <h1 className="heading-responsive text-gray-900 dark:text-white">
            ภาพรวมระบบ
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 body-responsive text-gray-600 dark:text-gray-300">
            <span>อัพเดทล่าสุด: {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm">ระบบทำงานปกติ</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={fetchStats}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="tap-target"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">รีเฟรช</span>
          </Button>
          <Button variant="outline" size="sm" className="tap-target">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">ส่งออก</span>
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards - Mobile First Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="group card-interactive animate-fade-in-scale hover:shadow-glow" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-4 sm:p-6 relative overflow-hidden">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                
                <div className="relative space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-soft group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${
                      stat.change.type === 'increase' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change.type === 'increase' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>{stat.change.value}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Key Metrics Row - Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-green-600">{resolutionRate}%</div>
            <p className="text-xs text-gray-600">อัตราการแก้ไข</p>
          </CardContent>
        </Card>
        
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{Math.round(stats.avgResponseTime)}</div>
            <p className="text-xs text-gray-600">ชั่วโมงเฉลี่ย</p>
          </CardContent>
        </Card>
        
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Calendar className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-orange-600">{stats.todayComplaints}</div>
            <p className="text-xs text-gray-600">วันนี้</p>
          </CardContent>
        </Card>
        
        <Card className="card-modern">
          <CardContent className="p-4 text-center">
            <Zap className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-xl sm:text-2xl font-bold text-purple-600">98%</div>
            <p className="text-xs text-gray-600">ความพึงพอใจ</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section - Mobile Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Monthly Trends Chart */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span>แนวโน้มรายเดือน</span>
            </CardTitle>
            <CardDescription>จำนวนเรื่องร้องเรียนในช่วง 6 เดือนที่ผ่านมา</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ab1616" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ab1616" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#9ca3af' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickLine={{ stroke: '#9ca3af' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [value, 'เรื่องร้องเรียน']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#ab1616" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorComplaints)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span>การแจกแจงตามประเภท</span>
            </CardTitle>
            <CardDescription>สัดส่วนเรื่องร้องเรียนแต่ละประเภท</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ displayName, percent }) => `${displayName} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [value, props.payload.displayName]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Distribution Chart - Full Width */}
      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <span>การแจกแจงตามความสำคัญ</span>
          </CardTitle>
          <CardDescription>จำนวนเรื่องร้องเรียนแต่ละระดับความสำคัญ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="displayName" 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#9ca3af' }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={{ stroke: '#9ca3af' }}
                />
                <Tooltip 
                  formatter={(value) => [value, 'จำนวน']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]}
                  fill="#ab1616"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions - Mobile Optimized */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="subheading-responsive text-gray-900 dark:text-white">
            การดำเนินการด่วน
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <Card className="group card-interactive animate-fade-in-scale hover:shadow-glow" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                <CardContent className="p-4 sm:p-6 relative overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-soft group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      {action.count > 0 && (
                        <Badge className={`${action.countColor} tap-target`}>
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-primary dark:text-primary group-hover:text-primary/80 transition-colors">
                      <span>ดูรายละเอียด</span>
                      <ArrowUp className="w-4 h-4 ml-1 rotate-45 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
