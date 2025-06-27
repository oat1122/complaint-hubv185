"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users,
  FileText
} from "lucide-react";

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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "เรื่องใหม่",
      value: stats.newComplaints,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "กำลังดำเนินการ",
      value: stats.inProgressComplaints,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "แก้ไขแล้ว",
      value: stats.resolvedComplaints,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">ภาพรวมระบบ</h1>
        <p className="text-gray-600 mt-2">สรุปข้อมูลเรื่องร้องเรียนในระบบ</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              สรุปวันนี้
            </CardTitle>
            <CardDescription>
              ข้อมูลเรื่องร้องเรียนในวันนี้
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เรื่องร้องเรียนใหม่วันนี้</span>
                <Badge className="bg-blue-50 text-blue-700">
                  {stats.todayComplaints} เรื่อง
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">เวลาตอบกลับเฉลี่ย</span>
                <Badge className="bg-green-50 text-green-700">
                  {stats.avgResponseTime} ชั่วโมง
                </Badge>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  ปรับปรุงข้อมูลล่าสุดเมื่อ {new Date().toLocaleTimeString('th-TH')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              การดำเนินการด่วน
            </CardTitle>
            <CardDescription>
              เมนูสำหรับการจัดการระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <a
                href="/dashboard/complaints?status=NEW"
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">ตรวจสอบเรื่องใหม่</span>
                  <Badge className="bg-orange-50 text-orange-700">
                    {stats.newComplaints}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  เรื่องร้องเรียนที่รอการตรวจสอบ
                </p>
              </a>
              
              <a
                href="/dashboard/complaints?status=IN_PROGRESS"
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">ติดตามความคืบหน้า</span>
                  <Badge className="bg-yellow-50 text-yellow-700">
                    {stats.inProgressComplaints}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  เรื่องร้องเรียนที่กำลังดำเนินการ
                </p>
              </a>

              <a
                href="/dashboard/statistics"
                className="block p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">ดูรายงานสถิติ</span>
                  <Badge className="bg-blue-50 text-blue-700">
                    รายงาน
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  สถิติและกราฟแสดงผลการดำเนินงาน
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
