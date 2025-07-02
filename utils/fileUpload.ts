import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { MAX_FILE_SIZE, MAX_FILES } from './constants';
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.gif',
  '.pdf', '.txt', '.doc', '.docx'
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateFile(file: File): FileValidationResult {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (สูงสุด 5MB)`
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `ไฟล์ ${file.name} ประเภทไม่รองรับ`
    };
  }

  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      isValid: false,
      error: `นามสกุลไฟล์ ${extension} ไม่รองรับ`
    };
  }

  const suspiciousPatterns = [
    /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i,
    /\.php$/i, /\.jsp$/i, /\.asp$/i, /\.js$/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    return {
      isValid: false,
      error: `ไฟล์ ${file.name} อาจเป็นอันตราย`
    };
  }

  return { isValid: true };
}

export async function saveFile(file: File, complaintId: string): Promise<string> {
  const uploadDir = join(process.cwd(), 'uploads');

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  const safeFilename = `${complaintId}-${timestamp}-${randomStr}${extension}`;

  const filepath = join(uploadDir, safeFilename);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filepath, buffer);

  return `/uploads/${safeFilename}`;
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase();
}
