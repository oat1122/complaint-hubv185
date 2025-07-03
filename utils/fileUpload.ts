import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { Readable } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import clamav from 'clamav.js';
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

const MAGIC_BYTES: Record<string, number[]> = {
  'image/jpeg': [0xff, 0xd8, 0xff],
  'image/png': [0x89, 0x50, 0x4e, 0x47],
  'image/gif': [0x47, 0x49, 0x46, 0x38],
  'application/pdf': [0x25, 0x50, 0x44, 0x46]
};

async function verifyMagicBytes(file: File): Promise<boolean> {
  const expected = MAGIC_BYTES[file.type];
  if (!expected) return true;
  const slice = file.slice(0, expected.length);
  const bytes = new Uint8Array(await slice.arrayBuffer());
  return expected.every((b, i) => bytes[i] === b);
}

async function scanForMalware(file: File): Promise<void> {
  const host = process.env.CLAMAV_HOST;
  if (!host) return;
  const port = parseInt(process.env.CLAMAV_PORT || '3310', 10);
  const scanner = clamav.createScanner(port, host);
  const stream = Readable.fromWeb(
    file.stream() as unknown as NodeReadableStream
  );
  await new Promise<void>((resolve, reject) => {
    scanner.scan(stream, (err: any, _file: any, malicious: any) => {
      if (err) return reject(err);
      if (malicious) return reject(new Error(malicious));
      resolve();
    });
  });
}

export async function validateFile(file: File): Promise<FileValidationResult> {
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

  const magicOk = await verifyMagicBytes(file);
  if (!magicOk) {
    return {
      isValid: false,
      error: `ไฟล์ ${file.name} ไม่ตรงกับประเภทที่ระบุ`
    };
  }

  try {
    await scanForMalware(file);
  } catch (err) {
    return {
      isValid: false,
      error: 'ไฟล์ไม่ผ่านการสแกนมัลแวร์'
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
