import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { join } from 'path';
import { readFile } from 'fs/promises';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: params.id },
    });

    if (!attachment) {
      return NextResponse.json({ error: 'ไม่พบไฟล์' }, { status: 404 });
    }

    const filePath = join(process.cwd(), 'public', attachment.url.replace(/^\//, ''));
    const fileBuffer = await readFile(filePath);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': attachment.fileType,
        'Content-Disposition': `attachment; filename="${attachment.filename}"`,
      },
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์' }, { status: 500 });
  }
}
