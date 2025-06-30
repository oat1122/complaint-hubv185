"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Search,
  Filter,
  Calendar,
  FileText,
  Eye,
  Edit,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Download,
  Hash,
  MessageSquare,
  Tag,
  SortAsc,
  SortDesc,
  AlertTriangle,
  Clock,
  CheckCircle,
  Paperclip
} from "lucide-react";
import { formatDate, getPriorityColor, getStatusColor, getPriorityLabel, getStatusLabel } from "@/lib/utils";
import { STATUS_LEVELS, PRIORITY_LEVELS, COMPLAINT_CATEGORIES } from "@/lib/constants";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  trackingId: string;
  createdAt: string;
  attachments: Array<{
    id: string;
    filename: string;
    url: string;
    fileSize: number;
    fileType: string;
  }>;
}

interface FilterState {
  search: string;
  status: string;
  category: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="flex space-x-4 p-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="text-center py-12">
      <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        ไม่พบเรื่องร้องเรียน
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        ไม่มีเรื่องร้องเรียนที่ตรงกับเงื่อนไขการค้นหา
      </p>
    </div>
  );
}

// Complaint Detail Modal Component
function ComplaintDetailModal({ 
  complaint, 
  onClose, 
  onUpdateStatus 
}: { 
  complaint: Complaint | null; 
  onClose: () => void; 
  onUpdateStatus: (id: string, status: string) => void;
}) {
  if (!complaint) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-scale">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              รายละเอียดเรื่องร้องเรียน
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">รหัสติดตาม</label>
              <p className="font-mono text-lg">{complaint.trackingId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">หัวข้อ</label>
              <p className="text-lg font-medium">{complaint.title}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">รายละเอียด</label>
              <p className="text-gray-700 dark:text-gray-300">{complaint.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ประเภท</label>
                <div className="mt-1">
                  <CategoryBadge category={complaint.category} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ความสำคัญ</label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(complaint.priority)}>
                    {getPriorityLabel(complaint.priority)}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">สถานะ</label>
                <div className="mt-1">
                  <Badge className={getStatusColor(complaint.status)}>
                    {getStatusLabel(complaint.status)}
                  </Badge>
                </div>
              </div>
            </div>
            {complaint.attachments.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ไฟล์แนบ</label>
                <div className="mt-2 space-y-2">
                  {complaint.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Paperclip className="w-4 h-4" />
                      <span className="flex-1">{attachment.filename}</span>
                      <Button size="sm" variant="outline" asChild>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>เปิดไฟล์</span>
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    category: "all", 
    priority: "all",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, filters]);

  const fetchComplaints = async () => {
    if (!refreshing) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        ...(filters.status !== "all" && { status: filters.status }),
        ...(filters.category !== "all" && { category: filters.category }),
        ...(filters.priority !== "all" && { priority: filters.priority }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(`/api/admin/complaints?${params}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data.complaints || []);
        setTotalPages(Math.ceil((data.pagination?.totalCount || 0) / itemsPerPage));
        setTotalCount(data.pagination?.totalCount || 0);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const updateComplaintStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/complaints/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchComplaints();
        // Update selected complaint if it's open
        if (selectedComplaint?.id === id) {
          setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSort = (column: string) => {
    setFilters(prev => ({
      ...prev,
      sortBy: column,
      sortOrder: prev.sortBy === column && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      category: "all",
      priority: "all", 
      sortBy: "createdAt",
      sortOrder: "desc"
    });
    setCurrentPage(1);
  };

  if (loading && !refreshing) {
    return (
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2 animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96"></div>
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4 animate-slide-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              จัดการเรื่องร้องเรียน
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              ดูและจัดการเรื่องร้องเรียนทั้งหมดในระบบ • {totalCount.toLocaleString()} รายการ
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              รีเฟรช
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              ส่งออก
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>ตัวกรองและค้นหา</span>
            </div>
            {(filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.priority !== 'all') && (
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                ล้างตัวกรอง
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาเรื่องร้องเรียน..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                {STATUS_LEVELS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center space-x-2">
                      {status.value === 'NEW' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {status.value === 'IN_PROGRESS' && <Clock className="w-4 h-4 text-yellow-500" />}
                      {status.value === 'RESOLVED' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      <span>{status.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="ประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ประเภททั้งหมด</SelectItem>
                {COMPLAINT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center space-x-2">
                      <category.icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={filters.priority} onValueChange={(value) => handleFilterChange('priority', value)}>
              <SelectTrigger>
                <SelectValue placeholder="ความสำคัญ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ความสำคัญทั้งหมด</SelectItem>
                {PRIORITY_LEVELS.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints Table */}
      <Card className="hover-lift">
        <CardHeader>
          <CardTitle>
            รายการเรื่องร้องเรียน ({complaints.length.toLocaleString()} รายการ)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleSort('trackingId')}
                      >
                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <Hash className="w-4 h-4" />
                          <span>รหัสติดตาม</span>
                          {filters.sortBy === 'trackingId' && (
                            filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleSort('title')}
                      >
                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4" />
                          <span>หัวข้อ</span>
                          {filters.sortBy === 'title' && (
                            filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-left p-3">
                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <Tag className="w-4 h-4" />
                          <span>ประเภท</span>
                        </div>
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">ความสำคัญ</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">สถานะ</th>
                      <th 
                        className="text-left p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => handleSort('createdAt')}
                      >
                        <div className="flex items-center space-x-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>วันที่ส่ง</span>
                          {filters.sortBy === 'createdAt' && (
                            filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th className="text-left p-3 text-sm font-medium text-gray-600 dark:text-gray-400">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((complaint, index) => (
                      <tr 
                        key={complaint.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors animate-slide-in"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-3 font-mono text-sm">
                          <Badge variant="outline" className="font-medium">
                            {complaint.trackingId}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {complaint.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {complaint.description}
                            </p>
                          </div>
                        </td>
                        <td className="p-3">
                          <CategoryBadge category={complaint.category} />
                        </td>
                        <td className="p-3">
                          <Badge className={getPriorityColor(complaint.priority)}>
                            {getPriorityLabel(complaint.priority)}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Select
                            value={complaint.status}
                            onValueChange={(value) => updateComplaintStatus(complaint.id, value)}
                          >
                            <SelectTrigger className={`w-36 ${getStatusColor(complaint.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {STATUS_LEVELS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center space-x-2">
                                    {status.value === 'NEW' && <AlertTriangle className="w-4 h-4" />}
                                    {status.value === 'IN_PROGRESS' && <Clock className="w-4 h-4" />}
                                    {status.value === 'RESOLVED' && <CheckCircle className="w-4 h-4" />}
                                    <span>{status.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(new Date(complaint.createdAt))}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedComplaint(complaint)}
                              className="hover-lift"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              ดู
                            </Button>
                            {complaint.attachments.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <Paperclip className="w-3 h-3 mr-1" />
                                {complaint.attachments.length}
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    หน้า {currentPage} จาก {totalPages} • แสดง {complaints.length} จาก {totalCount.toLocaleString()} รายการ
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="hover-lift"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      ก่อนหน้า
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="hidden sm:flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNumber}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="hover-lift"
                    >
                      ถัดไป
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Complaint Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdateStatus={updateComplaintStatus}
      />
    </div>
  );
}
