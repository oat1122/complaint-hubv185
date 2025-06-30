import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Update schema
const UpdateComplaintSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  category: z.enum([
    'TECHNICAL', 'PERSONNEL', 'ENVIRONMENT', 'EQUIPMENT', 'SAFETY', 
    'FINANCIAL', 'STRUCTURE_SYSTEM', 'WELFARE_SERVICES', 'PROJECT_IDEA', 'OTHER'
  ]).optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต - เฉพาะผู้ดูแลระบบเท่านั้น' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    
    const validatedData = UpdateComplaintSchema.parse(body);

    // Check if complaint exists
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'ไม่พบข้อร้องเรียนนี้' },
        { status: 404 }
      );
    }

    // Update complaint
    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
      include: {
        attachments: {
          select: {
            id: true,
            filename: true,
            fileType: true,
            fileSize: true,
            url: true,
          },
        },
      },
    });

    // Create notification for status change
    if (validatedData.status) {
      const notif = await prisma.notification.create({
        data: {
          title: 'อัปเดตสถานะข้อร้องเรียน',
          message: `ข้อร้องเรียน "${existingComplaint.title}" มีการเปลี่ยนสถานะเป็น "${validatedData.status}"`,
          type: 'status_update',
          complaintId: existingComplaint.id,
        },
      });

      const users = await prisma.user.findMany({ where: { isActive: true } });
      await prisma.userNotification.createMany({
        data: users.map((u) => ({ userId: u.id, notificationId: notif.id })),
      });
    }

    return NextResponse.json({
      success: true,
      complaint: updatedComplaint,
      message: 'อัปเดตข้อร้องเรียนเรียบร้อยแล้ว',
    });

  } catch (error) {
    console.error('Error updating complaint:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปเดต' },
      { status: 500 }
    );
  }
}

// GET single complaint details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "VIEWER")) {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต' },
        { status: 401 }
      );
    }

    const { id } = params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        attachments: true,
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'ไม่พบข้อร้องเรียนนี้' },
        { status: 404 }
      );
    }

    return NextResponse.json(complaint);

  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' },
      { status: 500 }
    );
  }
}

// DELETE complaint (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: 'ไม่ได้รับอนุญาต - เฉพาะผู้ดูแลระบบเท่านั้น' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Check if complaint exists
    const existingComplaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'ไม่พบข้อร้องเรียนนี้' },
        { status: 404 }
      );
    }

    // Delete complaint (attachments will be deleted by cascade)
    await prisma.complaint.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'ลบข้อร้องเรียนเรียบร้อยแล้ว',
    });

  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบ' },
      { status: 500 }
    );
  }
}
