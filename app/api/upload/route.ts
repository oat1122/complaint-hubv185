import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateFile, saveFile, sanitizeFilename } from '@/utils/fileUpload';
import { MAX_FILES } from '@/utils/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const complaintId = formData.get('complaintId') as string | null;
    const files = formData.getAll('files') as File[];

    if (!complaintId || files.length === 0) {
      return NextResponse.json(
        { error: 'ข้อมูลไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { error: `อัพโหลดได้สูงสุด ${MAX_FILES} ไฟล์` },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId }
    });
    if (!complaint) {
      return NextResponse.json(
        { error: 'ไม่พบข้อร้องเรียน' },
        { status: 404 }
      );
    }

    const uploaded: any[] = [];

    for (const file of files) {
      if (file.size === 0) continue;
      const validation = validateFile(file);
      if (!validation.isValid) {
        return NextResponse.json(
          { error: validation.error },
          { status: 400 }
        );
      }

      const url = await saveFile(file, complaintId);
      const attachment = await prisma.attachment.create({
        data: {
          filename: sanitizeFilename(file.name),
          url,
          fileSize: file.size,
          fileType: file.type,
          complaintId
        }
      });
      uploaded.push({
        ...attachment,
        url: `/api/files/${attachment.id}`
      });
    }

    return NextResponse.json({ success: true, attachments: uploaded });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: 500 }
    );
  }
}
