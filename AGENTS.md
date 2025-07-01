-สวัสดีการ
-บุคคล
-อื่นๆ

# ระบบร้องเรียนแบบไม่ระบุตัวตน (Anonymous Complaint System)

สร้างระบบร้องเรียนแบบไม่ระบุตัวตน (Anonymous Complaint System) โดยใช้ Next.js พร้อมข้อกำหนดดังนี้:

## 🔐 ระบบผู้ใช้งาน:

### **ผู้ร้องเรียน (Anonymous Users):**
- ไม่ต้อง login, ไม่เก็บข้อมูลส่วนตัว (anonymous)
- ส่งเรื่องร้องเรียนได้เท่านั้น

### **Admin (ผู้ดูแลระบบ):**
- **Username**: `admin`
- **Password**: `admin1234`
- **สิทธิ์**: อ่าน/ลบ/จัดการเรื่องร้องเรียนทั้งหมด
- **Dashboard**: เข้าถึงสถิติและรายงานครบถ้วน

### **Pna (ผู้ใช้งานพิเศษ):**
- **Username**: `Pna`
- **Password**: `Pna1234`
- **สิทธิ์**: **ดูได้อย่างเดียว (Read-Only)**
  - เข้าถึง Dashboard เหมือน Admin
  - ดูเรื่องร้องเรียนทั้งหมด
  - ดูสถิติและรายงาน
  - **ไม่สามารถ**: ลบ/แก้ไข/จัดการข้อมูลใดๆ
- **UI ปรับเปลี่ยน**: ซ่อนปุ่มลบ/แก้ไข, แสดงเฉพาะฟังก์ชัน View

## 📋 ฟีเจอร์หลัก:

### **ฝั่งผู้ร้องเรียน (Public Access):**
```javascript
// หน้าแรก - ฟอร์มร้องเรียน
- ฟอร์มส่งเรื่องร้องเรียนแบบไม่ระบุตัวตน
- เลือกประเภทปัญหา: 
  * เทคนิค (Technical Issues)
  * สิ่งแวดล้อม (Environment)
  * HR (Human Resources)
  * อุปกรณ์ (Equipment)
  * ความปลอดภัย (Safety & Security)
  * การเงิน (Financial)
  * อื่นๆ (Others)
- กำหนดระดับความสำคัญ: ต่ำ/ปานกลาง/สูง/ด่วนมาก
- รายละเอียดเรื่องร้องเรียน (Rich Text Editor)
- แนบไฟล์/รูปภาพได้ (สูงสุด 5 ไฟล์, 10MB/ไฟล์)
- หมายเลขติดตาม (Tracking Number) หลังส่งเรื่อง
```

### **ฝั่ง Admin Dashboard:**
```javascript
// สิทธิ์ Admin (admin/admin1234) - Full Access
- Dashboard สวยงามพร้อมสถิติและกราฟ
- จัดการเรื่องร้องเรียน (อ่าน/ลบ เท่านั้น - ไม่แก้ไข)
- กรองและค้นหาตามประเภท/วันที่/ความสำคัญ
- ส่งออกรายงาน (Excel/PDF)
- จัดการไฟล์แนบ
- สถิติแบบ Real-time
- การตั้งค่าระบบ

// สิทธิ์ Pna (Pna/Pna1234) - Read-Only
- ดู Dashboard เดียวกับ Admin
- ดูรายการเรื่องร้องเรียนทั้งหมด
- ดูรายละเอียดเรื่องร้องเรียน
- ดูไฟล์แนบ/ดาวน์โหลด
- กรองและค้นหาข้อมูล
- ดูสถิติและกราฟ
- ❌ ไม่สามารถลบ/แก้ไข/จัดการข้อมูล
- ❌ ไม่เข้าถึงการตั้งค่าระบบ
```

## 📊 Dashboard Features:

### **สถิติและรายงาน:**
```javascript
- จำนวนเรื่องร้องเรียนทั้งหมด
- แยกตามประเภทปัญหา (Chart)
- แยกตามระดับความสำคัญ
- กราฟแนวโน้มรายวัน/สัปดาห์/เดือน
- เรื่องใหม่วันนี้
- เรื่องที่รอดำเนินการ
- Top 5 ประเภทปัญหา
- สถิติการแนบไฟล์
```

### **การจัดการข้อมูล:**
```javascript
// Admin เท่านั้น
- ลบเรื่องร้องเรียน (พร้อม Confirm Dialog)
- ลบไฟล์แนบ
- Bulk Delete (เลือกหลายรายการ)
- Archive เรื่องเก่า

// Pna + Admin
- ดูรายละเอียดครบถ้วน
- ค้นหาขั้นสูง
- กรองข้อมูล
- ส่งออกรายงาน
```

## 🗄️ ฐานข้อมูล:

### **Database: "complaintdb" (MariaDB)**
```sql
-- ตาราง users (สำหรับ admin และ Pna)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'viewer') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ข้อมูลเริ่มต้น
INSERT INTO users (username, password, role) VALUES 
('admin', '$2b$10$hashedPasswordForAdmin1234', 'admin'),
('Pna', '$2b$10$hashedPasswordForPna1234', 'viewer');

-- ตาราง complaints (เรื่องร้องเรียน)
CREATE TABLE complaints (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  category ENUM('technical', 'environment', 'hr', 'equipment', 'safety', 'financial', 'others') NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('new', 'archived') DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_priority (priority),
  INDEX idx_created_at (created_at)
);

-- ตาราง attachments (ไฟล์แนบ)
CREATE TABLE attachments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  complaint_id INT NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (complaint_id) REFERENCES complaints(id) ON DELETE CASCADE
);
```

## 🎨 UI/UX Design:

### **หน้าแรก (Public):**
```javascript
- Clean, Simple Design
- ฟอร์มร้องเรียนใช้งานง่าย
- Progress Indicator
- File Upload with Preview
- Responsive Design
- การแสดงหมายเลขติดตาม
```

### **Admin Dashboard:**
```javascript
// Layout สำหรับ Admin
- Sidebar Navigation
- Stats Cards
- Interactive Charts (Recharts)
- Data Table with Pagination
- Search & Filter Panel
- Action Buttons (Delete สำหรับ Admin)

// Layout สำหรับ Pna
- เหมือน Admin แต่:
- ซ่อนปุ่ม Delete/Edit
- แสดง Badge "Read-Only Mode"
- เปลี่ยนสี Action Buttons เป็น View-only
- แสดงข้อความแจ้งเตือนสิทธิ์
```

## 🛠️ เทคโนโลยี:

### **Tech Stack:**
```javascript
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js (Custom Credentials Provider)
- Prisma ORM (MariaDB Connector)
- Recharts (Dashboard Charts)
- React Hook Form (Form Handling)
- Zod (Form Validation)
- Lucide React (Icons)
- Sharp (Image Processing)
```

### **Authentication Configuration:**
```javascript
// NextAuth.js Config
providers: [
  CredentialsProvider({
    credentials: {
      username: { type: "text" },
      password: { type: "password" }
    },
    authorize: async (credentials) => {
      // Validate against database
      // Return user with role
    }
  })
]

// Role-based Middleware
- Admin: full access
- Viewer (Pna): read-only access
- Redirect unauthorized actions
```

## 📱 Additional Features:

### **Security & Privacy:**
```javascript
- ไม่เก็บ IP Address ของผู้ร้องเรียน
- ไม่มี Session Tracking สำหรับ Anonymous
- File Upload Security (Type/Size Validation)
- Rate Limiting สำหรับการส่งเรื่อง
- CSRF Protection
```

### **File Management:**
```javascript
- รองรับไฟล์: .jpg, .png, .pdf, .doc, .docx
- ขนาดสูงสุด: 10MB ต่อไฟล์
- จำกัด 5 ไฟล์ต่อเรื่อง
- Auto-generate unique filename
- Virus Scanning (ถ้าจำเป็น)
```

### **Tracking System:**
```javascript
- หมายเลขติดตาม: CMP-YYYYMMDD-XXXX
- หน้าตรวจสอบสถานะ (Public)
- แสดงข้อมูลพื้นฐาน (ไม่ระบุตัวตน)
```

## 🚀 Deployment Requirements:



### **Production Optimizations:**
```javascript
- Image Optimization
- Database Indexing
- Caching Strategy
- Error Logging
- Performance Monitoring
```