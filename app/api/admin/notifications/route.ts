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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const userId = session.user.id;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId };
    if (unreadOnly) {
      where.read = false;
    }

    // Fetch notifications
    const [rows, totalCount, unreadCount] = await Promise.all([
      prisma.userNotification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { notification: true },
      }),
      prisma.userNotification.count({ where }),
      prisma.userNotification.count({ where: { userId, read: false } }),
    ]);

    const notifications = rows.map((r) => ({
      id: r.notification.id,
      title: r.notification.title,
      message: r.notification.message,
      type: r.notification.type,
      complaintId: r.notification.complaintId,
      read: r.read,
      createdAt: r.notification.createdAt,
    }));

    // Get recent complaints for system alerts
    const recentComplaints = await prisma.complaint.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
        priority: true,
        status: true,
        trackingId: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Generate system alerts
    const systemAlerts = [];
    
    // High priority complaints
    const highPriorityCount = recentComplaints.filter((c: any) => c.priority === 'HIGH' || c.priority === 'URGENT').length;
    if (highPriorityCount > 0) {
      systemAlerts.push({
        id: 'high-priority-alert',
        title: 'ข้อร้องเรียนความสำคัญสูง',
        message: `มีข้อร้องเรียนความสำคัญสูง ${highPriorityCount} เรื่องในวันนี้`,
        type: 'high_priority',
        read: false,
        createdAt: new Date(),
      });
    }

    // Safety complaints
    const safetyComplaints = recentComplaints.filter((c: any) => c.category === 'SAFETY').length;
    if (safetyComplaints > 0) {
      systemAlerts.push({
        id: 'safety-alert',
        title: 'แจ้งเตือนด้านความปลอดภัย',
        message: `มีข้อร้องเรียนด้านความปลอดภัย ${safetyComplaints} เรื่องใหม่`,
        type: 'safety',
        read: false,
        createdAt: new Date(),
      });
    }

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      notifications,
      systemAlerts,
      recentComplaints,
      stats: {
        totalCount,
        unreadCount,
        recentCount: recentComplaints.length,
      },
      pagination: {
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VIEWER")) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { notificationId, markAllAsRead } = body;

    const userId = session.user.id;

    if (markAllAsRead) {
      // Mark all notifications as read for this user
      await prisma.userNotification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        message: 'อ่านการแจ้งเตือนทั้งหมดแล้ว',
      });
    } else if (notificationId) {
      // Mark specific notification as read
      await prisma.userNotification.update({
        where: {
          userId_notificationId: { userId, notificationId },
        },
        data: { read: true },
      });

      return NextResponse.json({
        success: true,
        message: 'อ่านการแจ้งเตือนแล้ว',
      });
    } else {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ครบถ้วน' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพเดทการแจ้งเตือน' },
      { status: 500 }
    );
  }
}
