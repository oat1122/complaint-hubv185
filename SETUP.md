# Complaint Hub - Setup Instructions

## การติดตั้งและใช้งาน

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่าฐานข้อมูล
สร้างฐานข้อมูล MySQL และแก้ไข `.env` file:
```
DATABASE_URL="mysql://username:password@localhost:3306/complaintdb"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. สร้างโครงสร้างฐานข้อมูล
```bash
npm run db:push
```

### 4. เพิ่มข้อมูลทดสอบ
```bash
npm run db:seed
```

### 5. เรียกใช้งาน
```bash
npm run dev
```

## บัญชีทดสอบ

### Admin
- Email: admin@example.com
- Password: admin123

### Viewer
- Email: viewer@example.com  
- Password: viewer123

## Features ที่พัฒนาแล้ว

### 1. หน้าแรก (/)
- ฟอร์มส่งเรื่องร้องเรียนแบบไม่เปิดเผยตัวตน
- อัปโหลดไฟล์แนบได้
- ระบบติดตามด้วยรหัส Tracking ID

### 2. ตรวจสอบสถานะ (/tracking)
- ค้นหาเรื่องร้องเรียนด้วย Tracking ID
- แสดงรายละเอียดและความคืบหน้า
- ดาวน์โหลดไฟล์แนบ

### 3. ระบบ Authentication (/auth/signin)
- เข้าสู่ระบบด้วย NextAuth.js
- รองรับ Role-based access (admin/viewer)

### 4. Dashboard (/dashboard)
- สรุปสถิติระบบ
- จัดการเรื่องร้องเรียน

## API Endpoints

### Public APIs
- `POST /api/complaints` - ส่งเรื่องร้องเรียนใหม่
- `GET /api/complaints?trackingId=XXX` - ดูข้อมูลเรื่องร้องเรียน

### Protected APIs (ต้อง login)
- `GET /api/dashboard/stats` - สถิติสำหรับ dashboard

## เทคโนโลยีที่ใช้

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS, ShadCN UI, Lucide Icons
- **Database**: MySQL + Prisma ORM  
- **Authentication**: NextAuth.js
- **State Management**: Zustand
- **Form**: React Hook Form + Zod

## โครงสร้างโปรเจค

```
app/
├── (auth)/
│   └── signin/          # หน้า Login
├── dashboard/           # ระบบจัดการ
│   ├── layout.tsx      # Layout สำหรับ Dashboard
│   └── page.tsx        # หน้าแรก Dashboard
├── tracking/           # ตรวจสอบสถานะ
├── api/                # API Routes
│   ├── auth/           # NextAuth APIs
│   ├── complaints/     # Complaint APIs
│   └── dashboard/      # Dashboard APIs
└── globals.css         # Tailwind CSS

components/
├── ui/                 # ShadCN UI Components
├── form/              # Form Components
├── dashboard/         # Dashboard Components
└── providers/         # Context Providers

lib/
├── auth.ts            # NextAuth Configuration
├── prisma.ts          # Prisma Client
├── utils.ts           # Utility Functions
└── stores/            # Zustand Stores

prisma/
└── schema.prisma      # Database Schema
```

## การพัฒนาต่อ

1. เพิ่มหน้าจัดการเรื่องร้องเรียนใน Dashboard
3. Chart และ Analytics
4. Export PDF Report
5. ระบบ Comment/Response
6. File Upload optimization
7. การ Archive เรื่องเก่า

## หมายเหตุ

โปรเจคนี้พัฒนาตาม README ที่กำหนด ครอบคลุมฟีเจอร์หลักทั้งหมด พร้อมใช้งานและพัฒนาต่อได้
