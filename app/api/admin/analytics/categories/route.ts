import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VIEWER")) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '6months';
    const startDate = new Date();
    switch (timeRange) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Get category statistics
    const categoryStats = await prisma.complaint.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get category breakdown by status
    const categoryStatusBreakdown = await prisma.complaint.groupBy({
      by: ['category', 'status'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get category trends (last 6 months)
    const categoryTrends = await prisma.complaint.groupBy({
      by: ['category', 'createdAt'],
      _count: {
        id: true,
      },
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Calculate resolution times by category
    const resolvedComplaints = await prisma.complaint.findMany({
      where: {
        status: 'RESOLVED',
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        category: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const categoryResolutionTimes = resolvedComplaints.reduce((acc: Record<string, number[]>, complaint: any) => {
      const diffHours = (complaint.updatedAt.getTime() - complaint.createdAt.getTime()) / (1000 * 60 * 60);
      if (!acc[complaint.category]) {
        acc[complaint.category] = [];
      }
      acc[complaint.category].push(diffHours);
      return acc;
    }, {});

    // Process the data
    const processedStats = categoryStats.map((stat: any) => {
      const category = stat.category;
      const totalCount = stat._count.id;
      
      // Get status breakdown for this category
      const statusCounts = categoryStatusBreakdown
        .filter((item: any) => item.category === category)
        .reduce((acc: any, item: any) => {
          acc[item.status] = item._count.id;
          return acc;
        }, {} as Record<string, number>);

      // Calculate resolution time
      const resolutionTimes = categoryResolutionTimes[category] || [];
      const avgResolutionTime = resolutionTimes.length > 0
        ? resolutionTimes.reduce((sum: number, time: number) => sum + time, 0) / resolutionTimes.length
        : 0;

      // Calculate monthly trends for this category
      const trends = categoryTrends
        .filter((item: any) => item.category === category)
        .reduce((acc: Record<string, number>, item: any) => {
          const month = new Date(item.createdAt).toISOString().slice(0, 7); // YYYY-MM
          acc[month] = (acc[month] || 0) + item._count.id;
          return acc;
        }, {});

      return {
        category,
        totalCount,
        newCount: statusCounts.NEW || 0,
        inProgressCount: statusCounts.IN_PROGRESS || 0,
        resolvedCount: statusCounts.RESOLVED || 0,
        closedCount: statusCounts.CLOSED || 0,
        archivedCount: statusCounts.ARCHIVED || 0,
        avgResolutionTime: Math.round(avgResolutionTime * 100) / 100,
        monthlyTrends: trends,
        resolutionRate: totalCount > 0 ? Math.round(((statusCounts.RESOLVED || 0) / totalCount) * 100) : 0,
      };
    });

    // Calculate overall statistics
    const totalComplaints = categoryStats.reduce((sum: number, stat: any) => sum + stat._count.id, 0);
    const overallStats = {
      totalComplaints,
      totalCategories: categoryStats.length,
      mostCommonCategory: categoryStats[0]?.category || null,
      leastCommonCategory: categoryStats[categoryStats.length - 1]?.category || null,
    };

    return NextResponse.json({
      overallStats,
      categoryStats: processedStats,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error fetching category analytics:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสถิติ' },
      { status: 500 }
    );
  }
}
