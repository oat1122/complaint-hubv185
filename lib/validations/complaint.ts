import { z } from "zod";
import { COMPLAINT_CATEGORIES, PRIORITY_LEVELS } from "@/lib/constants";

const categoryValues = COMPLAINT_CATEGORIES.map(c => c.value) as [string, ...string[]];
const priorityValues = PRIORITY_LEVELS.map(p => p.value) as [string, ...string[]];

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
    .enum(priorityValues, {
      errorMap: () => ({ message: "กรุณาเลือกระดับความสำคัญ" }),
    }),
    
  attachments: z
    .array(z.instanceof(File))
    .max(5, "อัพโหลดได้สูงสุด 5 ไฟล์")
    .optional(),
});

export type ComplaintFormData = z.infer<typeof ComplaintSchema>;

// Category-specific validation rules
export const CategoryValidationRules = {
  SAFETY: {
    requiredFields: ["location", "urgencyLevel"],
    maxResolutionTime: 24, // hours
    autoEscalate: true
  },
  FINANCIAL: {
    requiredFields: ["amount", "department"],
    requireApproval: true
  },
  TECHNICAL: {
    requiredFields: ["systemName", "errorDetails"],
    autoAssignTo: "IT_TEAM",
    includeSystemInfo: true
  }
} as const;
