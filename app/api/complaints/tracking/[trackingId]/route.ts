import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { trackingId: string } }
) {
  try {
    const { trackingId } = params;

    const complaint = await prisma.complaint.findUnique({
      where: { trackingId },
      include: {
        attachments: {
          select: {
            id: true,
            filename: true,
            fileType: true,
            fileSize: true,
            url: true,
            createdAt: true,
          },
        },
      },
    });

    if (!complaint) {
      return NextResponse.json(
        { error: 'ไม่พบข้อร้องเรียนที่มีหมายเลขติดตามนี้' },
        { status: 404 }
      );
    }

    const attachments = complaint.attachments.map(att => ({
      ...att,
      url: `/api/files/${att.id}?trackingId=${complaint.trackingId}`
    }));

    return NextResponse.json({ ...complaint, attachments });
  } catch (error) {
    console.error('Error fetching complaint by trackingId:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการค้นหา' },
      { status: 500 }
    );
  }
}