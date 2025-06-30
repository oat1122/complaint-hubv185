import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'ไฟล์ใหญ่เกิน 5MB' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'ไฟล์ประเภทนี้ไม่รองรับ' };
  }

  return { isValid: true };
}

export async function saveFile(file: File, complaintId: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'public', 'uploads');

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const safeName = sanitizeFilename(file.name);
  const filename = `${complaintId}-${timestamp}-${safeName}`;
  const filepath = join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  return `/uploads/${filename}`;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.\-_ก-๙]/g, '')
    .substring(0, 200);
}
