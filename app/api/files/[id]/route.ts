import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const attachment = await prisma.attachment.findUnique({
      where: { id },
      include: { complaint: { select: { trackingId: true } } }
    });

    if (!attachment) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const trackingId = request.nextUrl.searchParams.get('trackingId');

    const hasAdminAccess =
      session && (session.user.role === 'ADMIN' || session.user.role === 'VIEWER');

    if (!hasAdminAccess && trackingId !== attachment.complaint.trackingId) {
      return NextResponse.json({ error: 'ไม่ได้รับอนุญาต' }, { status: 403 });
    }

    const filename = attachment.url.split('/').pop() || '';
    const filePath = join(process.cwd(), 'uploads', filename);

    const fileBuffer = await readFile(filePath).catch(() => null);
    if (!fileBuffer) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 404 });
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': attachment.fileType,
        'Content-Disposition': `attachment; filename="${attachment.filename}"`
      }
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์' },
      { status: 500 }
    );
  }
}
