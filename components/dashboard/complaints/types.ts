export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  trackingId: string;
  createdAt: string;
  updatedAt?: string;
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    fileSize: number;
    fileType: string;
  }>;
  responses?: Array<{
    id: string;
    message: string;
    createdAt: string;
    isAdmin: boolean;
  }>;
}

export interface FilterState {
  search: string;
  status: string;
  category: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
