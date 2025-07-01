import { 
  Wrench, 
  Users, 
  Leaf, 
  Settings, 
  Shield, 
  DollarSign, 
  Building, 
  Target, 
  Lightbulb, 
  FileText 
} from "lucide-react";

// Complaint Categories with Thai labels and descriptions
export const COMPLAINT_CATEGORIES = [
  {
    value: "TECHNICAL",
    label: "เทคนิค",
    description: "ปัญหาระบบเทคโนโลยี ซอฟต์แวร์ การทำงานทางเทคนิค",
    examples: ["ระบบล่ม", "เว็บไซต์ช้า", "แอปไม่ทำงาน", "ข้อมูลผิดพลาด"],
    icon: Wrench
  },
  {
    value: "PERSONNEL",
    label: "บุคคล",
    description: "ปัญหาบุคลากร การให้บริการ ความสัมพันธ์ในการทำงาน",
    examples: ["พนักงานให้บริการไม่ดี", "ขาดมารยาท", "ไม่ตรงเวลา", "ความขัดแย้ง"],
    icon: Users
  },
  {
    value: "ENVIRONMENT",
    label: "สภาพแวดล้อม",
    description: "ปัญหาสภาพแวดล้อมการทำงาน ความสะอาด บรรยากาศ",
    examples: ["ห้องสกปรก", "เสียงดัง", "อากาศร้อน", "แสงสว่างไม่เพียงพอ"],
    icon: Leaf
  },
  {
    value: "EQUIPMENT",
    label: "อุปกรณ์",
    description: "ปัญหาเครื่องมือ อุปกรณ์ สิ่งอำนวยความสะดวก",
    examples: ["เครื่องเสีย", "อุปกรณ์ไม่เพียงพอ", "คุณภาพต่ำ", "ไม่มีการบำรุงรักษา"],
    icon: Settings
  },
  {
    value: "SAFETY",
    label: "ความปลอดภัย",
    description: "ปัญหาความปลอดภัย การรักษาความปลอดภัย สุขภาพ",
    examples: ["พื้นลื่น", "ไฟดับ", "ไม่มีทางออกฉุกเฉิน", "อุบัติเหตุ", "อุปกรณ์ป้องกันไม่เพียงพอ"],
    icon: Shield
  },
  {
    value: "FINANCIAL",
    label: "การเงิน",
    description: "ปัญหาการเงิน การชำระเงิน การจัดการทางการเงิน",
    examples: ["เงินเดือนผิด", "ค่าใช้จ่ายสูง", "การเบิกจ่ายล่าช้า", "งบประมาณไม่เพียงพอ"],
    icon: DollarSign
  },
  {
    value: "STRUCTURE_SYSTEM",
    label: "โครงสร้างและระบบการทำงาน",
    description: "ปัญหาโครงสร้างองค์กร กระบวนการทำงาน ระบบบริหาร",
    examples: ["ขั้นตอนซับซ้อน", "การอนุมัติช้า", "ระบบไม่ชัดเจน", "การประสานงานไม่ดี"],
    icon: Building
  },
  {
    value: "WELFARE_SERVICES",
    label: "สวัสดิการและบริการ",
    description: "ปัญหาสวัสดิการ บริการต่างๆ สิทธิประโยชน์",
    examples: ["สวัสดิการไม่เพียงพอ", "บริการไม่ครบถ้วน", "การรักษาพยาบาล", "ประกันสังคม"],
    icon: Target
  },
  {
    value: "PROJECT_IDEA",
    label: "เสนอโปรเจค-ไอเดีย",
    description: "ข้อเสนอแนะ ไอเดียใหม่ โครงการพัฒนา",
    examples: ["ปรับปรุงระบบ", "โครงการใหม่", "นวัตกรรม", "การพัฒนาองค์กร"],
    icon: Lightbulb
  },
  {
    value: "OTHER",
    label: "อื่นๆ",
    description: "ปัญหาที่ไม่อยู่ในหมวดหมู่ข้างต้น",
    examples: ["เรื่องทั่วไป", "ข้อสงสัย", "ปัญหาเฉพาะ"],
    icon: FileText
  }
] as const;

// Priority levels
export const PRIORITY_LEVELS = [
  { value: "LOW", label: "ต่ำ", color: "text-green-700 bg-green-50" },
  { value: "MEDIUM", label: "ปานกลาง", color: "text-yellow-700 bg-yellow-50" },
  { value: "HIGH", label: "สูง", color: "text-red-700 bg-red-50" },
  { value: "URGENT", label: "เร่งด่วน", color: "text-purple-700 bg-purple-50" },
] as const;

// Status levels
export const STATUS_LEVELS = [
  { value: "NEW", label: "ใหม่", color: "text-blue-700 bg-blue-50" },
  { value: "IN_PROGRESS", label: "กำลังดำเนินการ", color: "text-yellow-700 bg-yellow-50" },
  { value: "RESOLVED", label: "แก้ไขแล้ว", color: "text-green-700 bg-green-50" },
  { value: "CLOSED", label: "ปิดเรื่อง", color: "text-gray-700 bg-gray-50" },
  { value: "ARCHIVED", label: "เก็บถาวร", color: "text-purple-700 bg-purple-50" },
] as const;

// Auto-suggest priority based on category
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

// TypeScript types
export type ComplaintCategory = typeof COMPLAINT_CATEGORIES[number]['value'];
export type ComplaintPriority = typeof PRIORITY_LEVELS[number]['value'];
export type ComplaintStatus = typeof STATUS_LEVELS[number]['value'];
