import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateTrackingId } from '@/lib/utils';
import { sanitizeInput } from '@/utils/sanitize';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { COMPLAINT_CATEGORIES, PRIORITY_LEVELS } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const priority = formData.get('priority') as string;
    const files = formData.getAll('files') as File[];

    // Validate required fields
    if (!title || !description || !category || !priority) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }

    // Validate category and priority
    const validCategories = COMPLAINT_CATEGORIES.map(c => c.value);
    const validPriorities = PRIORITY_LEVELS.map(p => p.value);
    
    if (!validCategories.includes(category as any)) {
      return NextResponse.json(
        { error: 'ประเภทปัญหาไม่ถูกต้อง' },
        { status: 400 }
      );
    }
    
    if (!validPriorities.includes(priority as any)) {
      return NextResponse.json(
        { error: 'ระดับความสำคัญไม่ถูกต้อง' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);

    // Generate tracking ID
    const trackingId = generateTrackingId();

    // Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        title: sanitizedTitle,
        description: sanitizedDescription,
        category: category as any,
        priority: priority as any,
        trackingId,
        status: 'NEW',
      },
    });

    // Handle file uploads
    const attachments = [];
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Create upload directory if it doesn't exist
          const uploadDir = join(process.cwd(), 'public', 'uploads');
          
          // Generate unique filename
          const timestamp = Date.now();
          const filename = `${timestamp}-${file.name}`;
          const filepath = join(uploadDir, filename);

          try {
            await writeFile(filepath, buffer);
            
            // Save attachment to database
            const attachment = await prisma.attachment.create({
              data: {
                filename: file.name,
                url: `/uploads/${filename}`,
                fileSize: file.size,
                fileType: file.type,
                complaintId: complaint.id,
              },
            });
            
            attachments.push(attachment);
          } catch (error) {
            console.error('Error saving file:', error);
          }
        }
      }
    }

    // Create notification for admin
    const notif = await prisma.notification.create({
      data: {
        title: 'เรื่องร้องเรียนใหม่',
        message: `มีเรื่องร้องเรียนใหม่: ${sanitizedTitle}`,
        type: 'info',
        complaintId: complaint.id,
      },
    });

    const users = await prisma.user.findMany({ where: { isActive: true } });
    await prisma.userNotification.createMany({
      data: users.map((u) => ({ userId: u.id, notificationId: notif.id })),
    });

    return NextResponse.json({
      success: true,
      trackingId: complaint.trackingId,
      message: 'ส่งเรื่องร้องเรียนเรียบร้อยแล้ว',
    });

  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการส่งเรื่องร้องเรียน' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');

    if (!trackingId) {
      return NextResponse.json(
        { error: 'กรุณาระบุหมายเลขติดตาม' },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findUnique({
      where: {
        trackingId: trackingId,
      },
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

    // Return complaint data without sensitive information
    return NextResponse.json({
      id: complaint.id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      priority: complaint.priority,
      status: complaint.status,
      trackingId: complaint.trackingId,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      attachments: complaint.attachments,
    });

  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการค้นหาข้อมูล' },
      { status: 500 }
    );
  }
}
