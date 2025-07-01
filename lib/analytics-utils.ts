export const getCategoryDisplayName = (category: string) => {
  const categoryMap: Record<string, string> = {
    TECHNICAL: 'เทคนิค',
    PERSONNEL: 'บุคคล',
    ENVIRONMENT: 'สภาพแวดล้อม',
    EQUIPMENT: 'อุปกรณ์',
    SAFETY: 'ความปลอดภัย',
    FINANCIAL: 'การเงิน',
    STRUCTURE_SYSTEM: 'โครงสร้างและระบบการทำงาน',
    WELFARE_SERVICES: 'สวัสดิการและบริการ',
    PROJECT_IDEA: 'เสนอโปรเจค-ไอเดีย',
    OTHER: 'อื่นๆ'
  };
  return categoryMap[category] || category;
};

export const calculatePerformanceScore = (resolutionRate: number, avgTime: number) => {
  return Math.round((resolutionRate + (100 - Math.min(avgTime / 24 * 100, 100))) / 2);
};

export const calculateDateRange = (timeRange: string) => {
  const months = timeRange === '1month' ? 1
    : timeRange === '3months' ? 3
    : timeRange === '1year' ? 12
    : 6;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  return { gte: startDate };
};
