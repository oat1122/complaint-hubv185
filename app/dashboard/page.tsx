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
  Users,
  FileText,
  Activity,
  BarChart3,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import Link from "next/link";

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
    }
  };

  const statCards = [
    {
      title: "เรื่องร้องเรียนทั้งหมด",
      value: stats.totalComplaints,
      icon: MessageSquare,
      gradient: "from-[#ab1616] to-[#750c0c]",
      change: { value: 12, type: 'increase' as const },
      description: "เพิ่มขึ้นจากเดือนที่แล้ว"
    },
    {
      title: "เรื่องใหม่",
      value: stats.newComplaints,
      icon: FileText,
      gradient: "from-orange-500 to-red-500",
      change: { value: 5, type: 'increase' as const },
      description: "รอการตรวจสอบ"
    },
    {
      title: "กำลังดำเนินการ",
      value: stats.inProgressComplaints,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
      change: { value: 3, type: 'decrease' as const },
      description: "อยู่ในขั้นตอนแก้ไข"
    },
    {
      title: "แก้ไขแล้ว",
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      change: { value: 18, type: 'increase' as const },
      description: "สำเร็จในเดือนนี้"
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

  if (loading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
        </div>
        
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-32 rounded-xl animate-pulse"></div>
          ))}
        </div>
        
        {/* Quick actions skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 h-40 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 animate-slide-in">
      {/* Enhanced Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            ภาพรวมระบบ
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            สรุปข้อมูลเรื่องร้องเรียนในระบบ • อัพเดทล่าสุด: {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
            ระบบทำงานปกติ
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={stat.title} className="group overflow-hidden hover-lift border-0 shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in-scale" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6 relative">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stat.value.toLocaleString()}
                    </p>
                    <div className={`flex items-center space-x-1 text-xs font-medium ${
                      stat.change.type === 'increase' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.change.type === 'increase' ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      <span>{stat.change.value}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-soft`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            การดำเนินการด่วน
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link key={action.title} href={action.href}>
              <Card className="group overflow-hidden hover-lift border-0 shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer animate-fade-in-scale" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                <CardContent className="p-6 relative">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-soft`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      {action.count > 0 && (
                        <Badge className={action.countColor}>
                          {action.count}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-primary dark:text-primary group-hover:text-primary/80 dark:group-hover:text-primary/80 transition-colors">
                      ดูรายละเอียด
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
