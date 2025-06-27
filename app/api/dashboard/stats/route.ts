import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log('Session in dashboard stats:', session);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VIEWER")) {
      console.log('Access denied. Role:', session?.user?.role);
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Fetch statistics
    const [
      totalComplaints,
      newComplaints,
      inProgressComplaints,
      resolvedComplaints,
      closedComplaints,
      archivedComplaints,
      todayComplaints,
      categoryStats,
      priorityStats,
      monthlyTrends
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'NEW' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { status: 'CLOSED' } }),
      prisma.complaint.count({ where: { status: 'ARCHIVED' } }),
      prisma.complaint.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      }),
      // Category breakdown
      prisma.complaint.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),
      // Priority breakdown
      prisma.complaint.groupBy({
        by: ['priority'],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),
      // Monthly trends (last 6 months)
      prisma.complaint.groupBy({
        by: ['createdAt'],
        _count: {
          id: true,
        },
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6)),
          },
        },
      }),
    ]);

    // Process monthly trends
    const monthlyData = monthlyTrends.reduce((acc: Record<string, number>, curr: any) => {
      const month = new Date(curr.createdAt).toISOString().slice(0, 7); // YYYY-MM format
      acc[month] = (acc[month] || 0) + curr._count.id;
      return acc;
    }, {});

    // Calculate average response time (based on resolved complaints)
    const resolvedComplaintsWithTime = await prisma.complaint.findMany({
      where: { status: 'RESOLVED' },
      select: {
        createdAt: true,
        updatedAt: true,
      },
      take: 100, // Sample for performance
    });

    const avgResponseTime = resolvedComplaintsWithTime.length > 0
      ? resolvedComplaintsWithTime.reduce((sum: number, complaint: any) => {
          const diffHours = (complaint.updatedAt.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60);
          return sum + diffHours;
        }, 0) / resolvedComplaintsWithTime.length
      : 0;

    const stats = {
      totalComplaints,
      newComplaints,
      inProgressComplaints,
      resolvedComplaints,
      closedComplaints,
      archivedComplaints,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100,
      todayComplaints,
      categoryBreakdown: categoryStats.map((stat: any) => ({
        category: stat.category,
        count: stat._count.id,
      })),
      priorityBreakdown: priorityStats.map((stat: any) => ({
        priority: stat.priority,
        count: stat._count.id,
      })),
      monthlyTrends: monthlyData,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}
