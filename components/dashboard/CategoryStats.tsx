import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

interface CategoryStatsProps {
  data: Array<{
    category: string;
    totalCount: number;
    resolvedCount: number;
    newCount: number;
    inProgressCount: number;
    avgResolutionTime: number;
    resolutionRate: number;
  }>;
}

export function CategoryStats({ data }: CategoryStatsProps) {
  // Transform data for chart
  const chartData = data.map(item => {
    const categoryInfo = COMPLAINT_CATEGORIES.find(c => c.value === item.category);
    return {
      ...item,
      categoryLabel: categoryInfo?.label || item.category,
      pending: item.totalCount - item.resolvedCount,
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>📊 สถิติตามประเภทปัญหา</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="categoryLabel" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  const labels = {
                    totalCount: 'ทั้งหมด',
                    resolvedCount: 'แก้ไขแล้ว',
                    pending: 'รอดำเนินการ'
                  };
                  return [value, labels[name as keyof typeof labels] || name];
                }}
              />
              <Bar dataKey="totalCount" fill="#3b82f6" name="totalCount" />
              <Bar dataKey="resolvedCount" fill="#10b981" name="resolvedCount" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category List */}
      <Card>
        <CardHeader>
          <CardTitle>📋 รายละเอียดตามประเภท</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[300px] overflow-y-auto">
            {data.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <CategoryBadge category={item.category} />
                  <div className="text-sm">
                    <p className="font-medium">{item.totalCount} เรื่อง</p>
                    <p className="text-muted-foreground text-xs">
                      แก้ไข: {item.resolvedCount} | ใหม่: {item.newCount} | กำลังดำเนินการ: {item.inProgressCount}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      อัตราการแก้ไข: {item.resolutionRate}%
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{Math.round(item.avgResolutionTime)}h</p>
                  <p className="text-muted-foreground text-xs">เฉลี่ย</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Summary stats component
export function CategorySummary({ data }: CategoryStatsProps) {
  const totalComplaints = data.reduce((sum, item) => sum + item.totalCount, 0);
  const totalResolved = data.reduce((sum, item) => sum + item.resolvedCount, 0);
  const overallResolutionRate = totalComplaints > 0 ? Math.round((totalResolved / totalComplaints) * 100) : 0;
  const avgResolutionTime = data.length > 0 
    ? Math.round(data.reduce((sum, item) => sum + item.avgResolutionTime, 0) / data.length)
    : 0;

  const topCategory = data.reduce((prev, current) => 
    prev.totalCount > current.totalCount ? prev : current, data[0]
  );

  const fastestCategory = data.reduce((prev, current) => 
    prev.avgResolutionTime < current.avgResolutionTime ? prev : current, data[0]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{totalComplaints}</div>
          <p className="text-xs text-muted-foreground">ข้อร้องเรียนทั้งหมด</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">{overallResolutionRate}%</div>
          <p className="text-xs text-muted-foreground">อัตราการแก้ไขโดยรวม</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">{avgResolutionTime}h</div>
          <p className="text-xs text-muted-foreground">เวลาแก้ไขเฉลี่ย</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm font-medium">
            <CategoryBadge category={topCategory?.category} />
          </div>
          <p className="text-xs text-muted-foreground">ประเภทที่พบบ่อยที่สุด</p>
        </CardContent>
      </Card>
    </div>
  );
}
