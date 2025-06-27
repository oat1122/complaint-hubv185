# 🤖 AI-Friendly Developer Guide - Complaint Hub System

## 🎯 What is this project?
**Complaint Hub** is a web application that allows people to submit complaints anonymously and administrators to manage them efficiently.

### Core Purpose
- **Public Users**: Submit complaints without revealing identity
- **Administrators**: View, manage, and analyze complaints through a dashboard
- **Tracking System**: Anyone can check complaint status using a tracking ID

---

## 🏗️ System Architecture

### Frontend (What users see)
```
📱 Public Form (Anonymous) → Submit complaints
🔍 Tracking Page → Check complaint status  
📊 Admin Dashboard → Manage complaints & view statistics
```

### Backend (How it works)
```
🔐 Authentication → NextAuth.js (login system)
💾 Database → MySQL with Prisma ORM
📁 File Storage → Multer + Sharp (image processing)
🔔 Notifications → Real-time updates
```

---

## 🛠️ Technology Stack (AI Implementation Guide)

### Primary Technologies
| Component | Technology | Purpose |
|-----------|------------|---------|
| **Web Framework** | Next.js 15 (App Router) | Modern React framework |
| **Language** | TypeScript | Type-safe JavaScript |
| **UI Framework** | TailwindCSS + ShadCN UI | Styling and components |
| **Forms** | React Hook Form + Zod | Form handling and validation |
| **Database** | MySQL + Prisma ORM | Data storage and queries |
| **Authentication** | NextAuth.js | User login system |
| **File Upload** | Multer + Sharp | Handle file uploads |
| **Charts** | Tremor | Data visualization |
| **Notifications** | Zustand + Sonner | State management and alerts |

---

## 📁 File Structure (App Router Pattern)

```
complaint-hub/
├── app/                          # Main application
│   ├── page.tsx                  # Public complaint form
│   ├── tracking/page.tsx         # Track complaint status
│   └── dashboard/                # Admin area
│       ├── page.tsx              # Dashboard overview
│       ├── complaints/           # Manage complaints
│       ├── statistics/           # Analytics page
│       └── settings/             # System settings
├── components/                   # Reusable UI components
│   ├── ui/                       # ShadCN components
│   ├── forms/                    # Form components
│   └── dashboard/                # Dashboard-specific components
├── lib/                          # Core libraries
│   ├── auth.ts                   # Authentication config
│   ├── prisma.ts                 # Database connection
│   └── middleware.ts             # Route protection
├── prisma/                       # Database schema
│   └── schema.prisma             # Database models
└── api/                          # Backend endpoints
    ├── complaints/               # Complaint operations
    ├── upload/                   # File upload
    └── auth/                     # Authentication
```

---

## 🎭 User Roles & Permissions

### Role Types
1. **Anonymous User** (No login required)
   - Submit new complaints
   - Track complaint status
   - Upload supporting files

2. **Viewer** (Basic admin)
   - View all complaints
   - Read-only dashboard access
   - Export reports

3. **Admin** (Full access)
   - All viewer permissions
   - Update complaint status
   - Manage users
   - System settings
   - Delete complaints

---

## 💾 Database Schema (Prisma Models)

```prisma
// Main complaint data
model Complaint {
  id          String   @id @default(cuid())
  title       String   @db.VarChar(255)
  description String   @db.Text
  category    String   @db.VarChar(100)
  priority    Priority @default(MEDIUM)
  trackingId  String   @unique @db.VarChar(20)
  status      Status   @default(NEW)
  attachments Attachment[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("complaints")
}

// File attachments
model Attachment {
  id          String    @id @default(cuid())
  filename    String    @db.VarChar(255)
  url         String    @db.VarChar(500)
  fileType    String    @db.VarChar(100)
  fileSize    Int
  complaintId String
  complaint   Complaint @relation(fields: [complaintId], references: [id], onDelete: Cascade)
  createdAt   DateTime  @default(now())
  
  @@map("attachments")
}

// Admin users
model User {
  id        String   @id @default(cuid())
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)
  role      Role     @default(VIEWER)
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  
  @@map("users")
}

// Enums for better data integrity
enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Status {
  NEW
  IN_PROGRESS
  RESOLVED
  CLOSED
  ARCHIVED
}

enum Role {
  VIEWER
  ADMIN
}

enum Category {
  TECHNICAL           // เทคนิค
  PERSONNEL           // บุคคล
  ENVIRONMENT         // สภาพแวดล้อม
  EQUIPMENT           // อุปกรณ์
  SAFETY              // ความปลอดภัย
  FINANCIAL           // การเงิน
  STRUCTURE_SYSTEM    // โครงสร้างและระบบการทำงาน
  WELFARE_SERVICES    // สวัสดิการและบริการ
  PROJECT_IDEA        // เสนอโปรเจค-ไอเดีย
  OTHER               // อื่นๆ
}
```

---

## 📋 ประเภทปัญหาและคำอธิบาย (Complaint Categories)

### รายการประเภทปัญหา

| ประเภท | อังกฤษ | คำอธิบาย | ตัวอย่าง |
|--------|---------|----------|----------|
| **🔧 เทคนิค** | TECHNICAL | ปัญหาเกี่ยวกับระบบเทคโนโลยี, ซอฟต์แวร์, และการทำงานทางเทคนิค | ระบบล่ม, เว็บไซต์ช้า, แอปไม่ทำงาน, ข้อมูลผิดพลาด |
| **👥 บุคคล** | PERSONNEL | ปัญหาเกี่ยวกับบุคลากร, การให้บริการ, และความสัมพันธ์ในการทำงาน | พนักงานให้บริการไม่ดี, ขาดมารยาท, ไม่ตรงเวลา, ความขัดแย้ง |
| **🌍 สภาพแวดล้อม** | ENVIRONMENT | ปัญหาเกี่ยวกับสภาพแวดล้อมในการทำงาน, ความสะอาด, และบรรยากาศ | ห้องสกปรก, เสียงดัง, อากาศร้อน, แสงสว่างไม่เพียงพอ |
| **🛠️ อุปกรณ์** | EQUIPMENT | ปัญหาเกี่ยวกับเครื่องมือ, อุปกรณ์, และสิ่งอำนวยความสะดวก | เครื่องเสีย, อุปกรณ์ไม่เพียงพอ, คุณภาพต่ำ, ไม่มีการบำรุงรักษา |
| **🛡️ ความปลอดภัย** | SAFETY | ปัญหาเกี่ยวกับความปลอดภัย, การรักษาความปลอดภัย, และสุขภาพ | พื้นลื่น, ไฟดับ, ไม่มีทางออกฉุกเฉิน, อุบัติเหตุ |
| **💰 การเงิน** | FINANCIAL | ปัญหาเกี่ยวกับการเงิน, การชำระเงิน, และการจัดการทางการเงิน | เงินเดือนผิด, ค่าใช้จ่ายสูง, การเบิกจ่ายล่าช้า, งบประมาณไม่เพียงพอ |
| **🏢 โครงสร้างและระบบการทำงาน** | STRUCTURE_SYSTEM | ปัญหาเกี่ยวกับโครงสร้างองกร, กระบวนการทำงาน, และระบบบริหารจัดการ | ขั้นตอนซับซ้อน, การอนุมัติช้า, ระบบไม่ชัดเจน, การประสานงานไม่ดี |
| **🎯 สวัสดิการและบริการ** | WELFARE_SERVICES | ปัญหาเกี่ยวกับสวัสดิการ, บริการต่างๆ, และสิทธิประโยชน์ | สวัสดิการไม่เพียงพอ, บริการไม่ครบถ้วน, การรักษาพยาบาล, ประกันสังคม |
| **💡 เสนอโปรเจค-ไอเดีย** | PROJECT_IDEA | ข้อเสนอแนะ, ไอเดียใหม่, และโครงการพัฒนา | ปรับปรุงระบบ, โครงการใหม่, นวัตกรรม, การพัฒนาองค์กร |
| **📝 อื่นๆ** | OTHER | ปัญหาหรือข้อร้องเรียนที่ไม่อยู่ในหมวดหมู่ข้างต้น | เรื่องทั่วไป, ข้อสงสัย, ปัญหาเฉพาะ |

### การใช้งานใน Code

```typescript
// ข้อมูล categories สำหรับ dropdown
export const COMPLAINT_CATEGORIES = [
  {
    value: "TECHNICAL",
    label: "🔧 เทคนิค",
    description: "ปัญหาระบบเทคโนโลยี ซอฟต์แวร์ การทำงานทางเทคนิค",
    examples: ["ระบบล่ม", "เว็บไซต์ช้า", "แอปไม่ทำงาน"]
  },
  {
    value: "PERSONNEL",
    label: "👥 บุคคล", 
    description: "ปัญหาบุคลากร การให้บริการ ความสัมพันธ์ในการทำงาน",
    examples: ["บริการไม่ดี", "ขาดมารยาท", "ไม่ตรงเวลา"]
  },
  {
    value: "ENVIRONMENT",
    label: "🌍 สภาพแวดล้อม",
    description: "ปัญหาสภาพแวดล้อมการทำงาน ความสะอาด บรรยากาศ", 
    examples: ["ห้องสกปรก", "เสียงดัง", "อากาศร้อน"]
  },
  {
    value: "EQUIPMENT", 
    label: "🛠️ อุปกรณ์",
    description: "ปัญหาเครื่องมือ อุปกรณ์ สิ่งอำนวยความสะดวก",
    examples: ["เครื่องเสีย", "อุปกรณ์ไม่เพียงพอ", "คุณภาพต่ำ"]
  },
  {
    value: "SAFETY",
    label: "🛡️ ความปลอดภัย", 
    description: "ปัญหาความปลอดภัย การรักษาความปลอดภัย สุขภาพ",
    examples: ["พื้นลื่น", "ไฟดับ", "ไม่มีทางออกฉุกเฉิน"]
  },
  {
    value: "FINANCIAL",
    label: "💰 การเงิน",
    description: "ปัญหาการเงิน การชำระเงิน การจัดการทางการเงิน", 
    examples: ["เงินเดือนผิด", "ค่าใช้จ่ายสูง", "การเบิกจ่ายล่าช้า"]
  },
  {
    value: "STRUCTURE_SYSTEM", 
    label: "🏢 โครงสร้างและระบบการทำงาน",
    description: "ปัญหาโครงสร้างองค์กร กระบวนการทำงาน ระบบบริหาร",
    examples: ["ขั้นตอนซับซ้อน", "การอนุมัติช้า", "ระบบไม่ชัดเจน"]
  },
  {
    value: "WELFARE_SERVICES",
    label: "🎯 สวัสดิการและบริการ", 
    description: "ปัญหาสวัสดิการ บริการต่างๆ สิทธิประโยชน์",
    examples: ["สวัสดิการไม่เพียงพอ", "บริการไม่ครบ", "การรักษาพยาบาล"]
  },
  {
    value: "PROJECT_IDEA",
    label: "💡 เสนอโปรเจค-ไอเดีย",
    description: "ข้อเสนอแนะ ไอเดียใหม่ โครงการพัฒนา",
    examples: ["ปรับปรุงระบบ", "โครงการใหม่", "นวัตกรรม"]
  },
  {
    value: "OTHER",
    label: "📝 อื่นๆ", 
    description: "ปัญหาที่ไม่อยู่ในหมวดหมู่ข้างต้น",
    examples: ["เรื่องทั่วไป", "ข้อสงสัย", "ปัญหาเฉพาะ"]
  }
] as const;

// Type สำหรับ TypeScript
export type ComplaintCategory = typeof COMPLAINT_CATEGORIES[number]['value'];
```

### Priority Mapping ตาม Category

```typescript
// แนะนำระดับความสำคัญตาม category
export const CATEGORY_PRIORITY_SUGGESTIONS = {
  SAFETY: "HIGH",           // ความปลอดภัย = สำคัญมาก
  TECHNICAL: "MEDIUM",      // เทคนิค = ปานกลาง  
  FINANCIAL: "HIGH",        // การเงิน = สำคัญมาก
  EQUIPMENT: "MEDIUM",      // อุปกรณ์ = ปานกลาง
  PERSONNEL: "MEDIUM",      // บุคคล = ปานกลาง
  ENVIRONMENT: "LOW",       // สภาพแวดล้อม = ต่ำ
  STRUCTURE_SYSTEM: "MEDIUM", // โครงสร้าง = ปานกลาง
  WELFARE_SERVICES: "LOW",  // สวัสดิการ = ต่ำ
  PROJECT_IDEA: "LOW",      // ไอเดีย = ต่ำ
  OTHER: "LOW"              // อื่นๆ = ต่ำ
} as const;
```

---

## 🔗 API Endpoints Guide

### Public Endpoints (No authentication required)
```typescript
// Submit new complaint
POST /api/complaints
{
  title: string,
  description: string,
  category: "TECHNICAL" | "PERSONNEL" | "ENVIRONMENT" | "EQUIPMENT" | "SAFETY" | "FINANCIAL" | "STRUCTURE_SYSTEM" | "WELFARE_SERVICES" | "PROJECT_IDEA" | "OTHER",
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
}

// Track complaint
GET /api/complaints/tracking/[trackingId]
// Returns: complaint details without personal data

// Upload files
POST /api/upload
// FormData with files, returns file URLs
```

### Protected Endpoints (Admin only)
```typescript
// Get all complaints (with pagination)
GET /api/admin/complaints?page=1&limit=10&status=NEW

// Update complaint status
PATCH /api/admin/complaints/[id]
{
  status: "IN_PROGRESS" | "RESOLVED" | "CLOSED"
}

// Get dashboard statistics with category breakdown
GET /api/admin/dashboard/stats
// Returns: counts by status, category, priority, monthly trends

// Get complaints by category
GET /api/admin/complaints?category=TECHNICAL&status=NEW

// Get category statistics
GET /api/admin/analytics/categories
// Returns: complaint counts per category, trends, resolution times

// Get notifications
GET /api/admin/notifications
// Returns: recent complaints, system alerts
```

---

## 🎨 UI Components สำหรับ Categories

### Category Selector Component

```typescript
// components/CategorySelector.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

interface CategorySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  showDescription?: boolean;
}

export function CategorySelector({ value, onChange, showDescription = false }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="เลือกประเภทปัญหา" />
        </SelectTrigger>
        <SelectContent>
          {COMPLAINT_CATEGORIES.map((category) => (
            <SelectItem key={category.value} value={category.value} className="py-3">
              <div className="flex flex-col items-start">
                <span className="font-medium">{category.label}</span>
                {showDescription && (
                  <span className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {value && showDescription && (
        <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <p className="font-medium">ตัวอย่างปัญหา:</p>
          <ul className="list-disc list-inside mt-1">
            {COMPLAINT_CATEGORIES.find(c => c.value === value)?.examples.map((example, index) => (
              <li key={index}>{example}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Category Badge Component

```typescript
// components/CategoryBadge.tsx
import { Badge } from "@/components/ui/badge";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "secondary" | "outline";
}

export function CategoryBadge({ category, variant = "default" }: CategoryBadgeProps) {
  const categoryData = COMPLAINT_CATEGORIES.find(c => c.value === category);
  
  if (!categoryData) return null;

  const colorMap = {
    TECHNICAL: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    PERSONNEL: "bg-purple-100 text-purple-800 hover:bg-purple-200", 
    ENVIRONMENT: "bg-green-100 text-green-800 hover:bg-green-200",
    EQUIPMENT: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    SAFETY: "bg-red-100 text-red-800 hover:bg-red-200",
    FINANCIAL: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    STRUCTURE_SYSTEM: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    WELFARE_SERVICES: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    PROJECT_IDEA: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    OTHER: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  return (
    <Badge 
      variant={variant}
      className={`${colorMap[category as keyof typeof colorMap]} transition-colors`}
    >
      {categoryData.label}
    </Badge>
  );
}
```

### Category Statistics Dashboard

```typescript
// components/CategoryStats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryBadge } from "./CategoryBadge";

interface CategoryStatsProps {
  data: Array<{
    category: string;
    count: number;
    resolved: number;
    pending: number;
    avgResolutionTime: number;
  }>;
}

export function CategoryStats({ data }: CategoryStatsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>📊 สถิติตามประเภทปัญหา</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="ทั้งหมด" />
              <Bar dataKey="resolved" fill="#10b981" name="แก้ไขแล้ว" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category List */}
      <Card>
        <CardHeader>
          <CardTitle>📋 รายละเอียดตามประเภท</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CategoryBadge category={item.category} />
                  <div className="text-sm">
                    <p className="font-medium">{item.count} เรื่อง</p>
                    <p className="text-muted-foreground">
                      แก้ไข: {item.resolved} | รอ: {item.pending}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium">{item.avgResolutionTime}h</p>
                  <p className="text-muted-foreground">เฉลี่ย</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🚀 AI Implementation Steps

### Phase 1: Basic Setup
1. **Initialize Project**
   ```bash
   npx create-next-app@latest complaint-hub --typescript --tailwind --app
   cd complaint-hub
   npm install prisma @prisma/client nextauth bcryptjs
   ```

2. **Database Setup**
   ```bash
   npx prisma init
   # Edit DATABASE_URL in .env
   npx prisma db push
   npx prisma generate
   ```

3. **Authentication Setup**
   - Configure NextAuth.js
   - Create login/logout pages
   - Setup middleware for route protection

### Phase 2: Core Features
1. **Public Complaint Form**
   - React Hook Form with Zod validation
   - Category selector with descriptions and examples
   - Auto-suggest priority based on category
   - File upload functionality
   - Generate unique tracking ID

2. **Tracking System**
   - Public tracking page
   - Status display with category badge
   - Category-specific status messages

3. **Admin Dashboard**
   - Complaint list with category filters
   - Category-based statistics and charts
   - Status update functionality
   - Category performance analytics

### Phase 3: Advanced Features
1. **Real-time Updates**
   - WebSocket or polling for new complaints
   - Notification system

2. **Analytics Dashboard**
   - Charts and graphs using Tremor
   - Export functionality

3. **Security Hardening**
   - Input sanitization
   - CSRF protection
   - Rate limiting

---

## 🎨 Recommended Additional Features

### 1. **Auto-Categorization System**
```typescript
// AI-powered category suggestion
POST /api/ai/categorize
{
  description: string
} 
// Returns: suggested category and confidence score
```

### 2. **Sentiment Analysis**
```typescript
// Analyze complaint sentiment
interface SentimentResult {
  score: number; // -1 to 1
  label: "negative" | "neutral" | "positive";
  urgency: "low" | "medium" | "high";
}
```

### 3. **Smart Notifications**
```typescript
// Intelligent alert system
interface SmartAlert {
  type: "urgent_complaint" | "trend_detected" | "sla_breach";
  message: string;
  priority: number;
  autoResolve: boolean;
}
```

### 4. **Advanced Analytics**
- **Trend Detection**: Identify recurring issues
- **Response Time Tracking**: SLA monitoring
- **Customer Satisfaction**: Follow-up surveys
- **Predictive Analytics**: Forecast complaint volumes

### 5. **Multi-Channel Integration**
- **Email Integration**: Auto-create complaints from emails
- **Chat Integration**: Real-time support chat
- **API Webhooks**: Third-party system integration
- **Mobile App**: Native mobile application

### 6. **Enhanced Security**
```typescript
// Advanced security features
interface SecurityFeatures {
  reCaptcha: boolean;
  rateLimiting: number; // requests per minute
  ipBlocking: string[];
  contentModeration: boolean;
  encryptedStorage: boolean;
}
```

### 7. **Workflow Automation**
```typescript
// Automated workflows
interface WorkflowRule {
  trigger: "new_complaint" | "status_change" | "time_based";
  conditions: Record<string, any>;
  actions: ("assign_user" | "send_email" | "update_status")[];
}
```

---

## 🔧 Environment Configuration

```bash
# .env.local
DATABASE_URL="mysql://user:password@localhost:3306/complaint_hub"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES="jpg,jpeg,png,pdf,doc,docx"

# Category Settings
DEFAULT_CATEGORY="OTHER"
REQUIRE_CATEGORY_DESCRIPTION=true
AUTO_SUGGEST_PRIORITY=true
CATEGORY_ANALYTICS_ENABLED=true
```

### Validation Schemas

```typescript
// lib/validations/complaint.ts
import { z } from "zod";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

const categoryValues = COMPLAINT_CATEGORIES.map(c => c.value) as [string, ...string[]];

export const ComplaintSchema = z.object({
  title: z
    .string()
    .min(5, "หัวเรื่องต้องมีอย่างน้อย 5 ตัวอักษร")
    .max(200, "หัวเรื่องต้องไม่เกิน 200 ตัวอักษร"),
    
  description: z
    .string()
    .min(10, "รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร")
    .max(2000, "รายละเอียดต้องไม่เกิน 2000 ตัวอักษร"),
    
  category: z
    .enum(categoryValues, {
      errorMap: () => ({ message: "กรุณาเลือกประเภทปัญหา" }),
    }),
    
  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"], {
      errorMap: () => ({ message: "กรุณาเลือกระดับความสำคัญ" }),
    }),
    
  attachments: z
    .array(z.instanceof(File))
    .max(5, "อัพโหลดได้สูงสุด 5 ไฟล์")
    .optional(),
});

export type ComplaintFormData = z.infer<typeof ComplaintSchema>;

// Category-specific validation
export const CategoryValidationRules = {
  SAFETY: {
    requiredFields: ["location", "urgencyLevel"],
    maxResolutionTime: 24, // hours
    autoEscalate: true
  },
  FINANCIAL: {
    requiredFields: ["amount", "department"],
    requireApproval: true,
    notifyRoles: ["ADMIN", "FINANCE_MANAGER"]
  },
  TECHNICAL: {
    requiredFields: ["systemName", "errorDetails"],
    autoAssignTo: "IT_TEAM",
    includeSystemInfo: true
  }
} as const;
```

---

## 📊 Performance Optimization

### Database Optimization
```sql
-- Recommended indexes
CREATE INDEX idx_complaints_status ON complaints(status);
CREATE INDEX idx_complaints_category ON complaints(category);
CREATE INDEX idx_complaints_created_at ON complaints(created_at);
CREATE INDEX idx_complaints_tracking_id ON complaints(tracking_id);
```

### Caching Strategy
```typescript
// Redis caching for frequent queries
interface CacheStrategy {
  dashboardStats: "5min";
  complaintLists: "1min";
  userSessions: "24h";
  staticContent: "1h";
}
```

---

## 🚀 Deployment Checklist

### Production Requirements
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] File upload directory permissions
- [ ] SSL certificate installed
- [ ] Rate limiting configured
- [ ] Monitoring setup (logs, metrics)
- [ ] Backup strategy implemented
- [ ] Security headers configured

### Monitoring & Maintenance
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Database backup automation
- [ ] Log rotation setup
- [ ] Health check endpoints

---

## 🎯 AI Assistant Prompt Templates

### For Feature Development
```
Create a [FEATURE NAME] for the Complaint Hub system using:
- Next.js 15 App Router
- TypeScript with strict mode
- TailwindCSS + ShadCN UI components
- Prisma ORM for database operations
- Follow the existing file structure in /app directory
- Include proper error handling and validation
- Add appropriate TypeScript interfaces
```

### For API Development
```
Build an API endpoint for [FUNCTIONALITY] that:
- Uses Next.js API routes
- Includes proper authentication middleware
- Validates input with Zod schemas
- Returns standardized JSON responses
- Includes error handling for edge cases
- Follows REST conventions
```

This guide should help AI assistants understand the project structure and implement features consistently!