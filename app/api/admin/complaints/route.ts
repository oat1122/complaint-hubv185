import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { normalizeSearchQuery } from '@/lib/utils';

// Query parameter validation schema
const QuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ARCHIVED']).optional(),
  category: z.enum([
    'TECHNICAL', 'PERSONNEL', 'ENVIRONMENT', 'EQUIPMENT', 'SAFETY', 
    'FINANCIAL', 'STRUCTURE_SYSTEM', 'WELFARE_SERVICES', 'PROJECT_IDEA', 'OTHER'
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'priority', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

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
    const queryParams = Object.fromEntries(searchParams.entries());
    
    const {
      page,
      limit,
      status,
      category,
      priority,
      search,
      sortBy,
      sortOrder
    } = QuerySchema.parse(queryParams);

    const normalizedSearch = search ? normalizeSearchQuery(search) : undefined;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build where clause
    const where: any = {};
    
    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    
    if (normalizedSearch) {
      where.OR = [
        { title: { contains: normalizedSearch } },
        { description: { contains: normalizedSearch } },
        { trackingId: { contains: normalizedSearch } },
      ];
    }

    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Fetch complaints with pagination
    const [complaints, totalCount] = await Promise.all([
      prisma.complaint.findMany({
        where,
        orderBy,
        skip,
        take: limitNumber,
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

    const totalPages = Math.ceil(totalCount / limitNumber);

    return NextResponse.json({
      complaints,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalCount,
        totalPages,
        hasNext: pageNumber < totalPages,
        hasPrev: pageNumber > 1,
      },
      filters: {
        status,
        category,
        priority,
        search: normalizedSearch,
      },
    });

  } catch (error) {
    console.error('Error fetching admin complaints:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}
