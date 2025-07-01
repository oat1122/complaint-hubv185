import { COMPLAINT_CATEGORIES, PRIORITY_LEVELS, STATUS_LEVELS } from "@/lib/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTrackingId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `TRK-${timestamp}-${randomStr}`.toUpperCase();
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

export function getPriorityColor(priority: string): string {
  const priorityData = PRIORITY_LEVELS.find(p => p.value === priority);
  return priorityData?.color || 'text-gray-600 bg-gray-50';
}

export function getStatusColor(status: string): string {
  const statusData = STATUS_LEVELS.find(s => s.value === status);
  return statusData?.color || 'text-gray-600 bg-gray-50';
}

export function getCategoryLabel(category: string): string {
  const categoryData = COMPLAINT_CATEGORIES.find(c => c.value === category);
  return categoryData?.label || category;
}

export function getPriorityLabel(priority: string): string {
  const priorityData = PRIORITY_LEVELS.find(p => p.value === priority);
  return priorityData?.label || priority;
}

export function getStatusLabel(status: string): string {
  const statusData = STATUS_LEVELS.find(s => s.value === status);
  return statusData?.label || status;
}
