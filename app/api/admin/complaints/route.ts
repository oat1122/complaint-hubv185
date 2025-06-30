import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ComplaintQuerySchema, executeWithRetry, createErrorResponse, createSuccessResponse } from '@/lib/rateLimiting';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VIEWER')) {
      return createErrorResponse('ไม่ได้รับอนุญาต', 401);
    }

    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());
    const validatedQuery = ComplaintQuerySchema.parse(queryParams);
    const { page, limit, status, category, priority, search, sortBy, sortOrder } = validatedQuery;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { trackingId: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    const [complaints, totalCount] = await executeWithRetry(async () => {
      return Promise.all([
        prisma.complaint.findMany({
          where,
          orderBy,
          skip,
          take: limit,
          include: {
            attachments: {
              select: {
                id: true,
                filename: true,
                fileType: true,
                fileSize: true,
              },
            },
          },
        }),
        prisma.complaint.count({ where }),
      ]);
    });

    const totalPages = Math.ceil(totalCount / limit);

    const response = {
      complaints,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      filters: {
        status,
        category,
        priority,
        search,
        sortBy,
        sortOrder,
      },
      timestamp: new Date().toISOString(),
    };

    return createSuccessResponse(response);
  } catch (error) {
    console.error('Error fetching admin complaints:', error);
    if (error instanceof Error && error.name === 'ZodError') {
      return createErrorResponse('ข้อมูลการค้นหาไม่ถูกต้อง', 400);
    }
    return createErrorResponse('เกิดข้อผิดพลาดในการดึงข้อมูล', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VIEWER')) {
      return createErrorResponse('ไม่ได้รับอนุญาต', 401);
    }

    const body = await request.json();
    const { groupBy, filters } = body;

    if (!groupBy || !['status', 'category', 'priority'].includes(groupBy)) {
      return createErrorResponse('กรุณาระบุประเภทการจัดกลุ่มที่ถูกต้อง', 400);
    }

    const where = filters || {};

    const stats = await executeWithRetry(async () => {
      return prisma.complaint.groupBy({
        by: [groupBy],
        _count: { id: true },
        where,
        orderBy: { _count: { id: 'desc' } },
      });
    });

    return createSuccessResponse({
      stats: stats.map((item: any) => ({
        [groupBy]: item[groupBy],
        count: item._count.id,
      })),
      groupBy,
      filters,
    });
  } catch (error) {
    console.error('Error fetching complaint stats:', error);
    return createErrorResponse('เกิดข้อผิดพลาดในการดึงสถิติ', 500);
  }
}
