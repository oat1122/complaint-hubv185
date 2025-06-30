export interface ApiResponse<T = any> {
  success?: boolean;
  error?: string;
  message?: string;
  data?: T;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface AttachmentResponse {
  id: string;
  filename: string;
  url: string;
  fileSize: number;
  fileType: string;
  createdAt: string;
}

export interface ComplaintResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  trackingId: string;
  createdAt: string;
  updatedAt?: string;
  attachments: AttachmentResponse[];
}

export interface DashboardStats {
  totalComplaints: number;
  newComplaints: number;
  inProgressComplaints: number;
  resolvedComplaints: number;
  closedComplaints: number;
  archivedComplaints: number;
  avgResponseTime: number;
  todayComplaints: number;
  categoryBreakdown: Array<{
    category: string;
    count: number;
  }>;
  priorityBreakdown: Array<{
    priority: string;
    count: number;
  }>;
  monthlyTrends: Record<string, number>;
}


export interface ComplaintFilters {
  search?: string;
  status?: string;
  category?: string;
  priority?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CreateComplaintRequest {
  title: string;
  description: string;
  category: string;
  priority: string;
  files?: File[];
}

export interface UpdateComplaintRequest {
  status?: string;
  priority?: string;
  category?: string;
}
