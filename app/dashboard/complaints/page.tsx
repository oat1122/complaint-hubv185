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
  Paperclip,
  X,
  User,
  ExternalLink,
  MoreVertical,
  Grid3X3,
  List,
  Settings,
  ChevronDown
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

interface FilterState {
  search: string;
  status: string;
  category: string;
  priority: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

function ComplaintCard({
  complaint,
  onView,
  onUpdateStatus
}: {
  complaint: Complaint;
  onView: (complaint: Complaint) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="card-modern mb-4 animate-fade-in-scale">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {complaint.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                #{complaint.trackingId}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-2 tap-target"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            <CategoryBadge category={complaint.category} />
            <Badge className={getPriorityColor(complaint.priority)}>
              {getPriorityLabel(complaint.priority)}
            </Badge>
            <Badge className={getStatusColor(complaint.status)}>
              {getStatusLabel(complaint.status)}
            </Badge>
            {complaint.attachments.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                <Paperclip className="w-3 h-3 mr-1" />
                {complaint.attachments.length}
              </Badge>
            )}
          </div>

          {isExpanded && (
            <div className="space-y-3 animate-slide-in">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {complaint.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(new Date(complaint.createdAt))}
                </span>
                {complaint.updatedAt && (
                  <span>อัพเดท: {formatDate(new Date(complaint.updatedAt))}</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex-1 mr-2">
              <Select
                value={complaint.status}
                onValueChange={(value) => onUpdateStatus(complaint.id, value)}
              >
                <SelectTrigger className={`h-8 text-xs ${getStatusColor(complaint.status)}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_LEVELS.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="text-xs">
                      <div className="flex items-center space-x-2">
                        {status.value === 'NEW' && <AlertTriangle className="w-3 h-3" />}
                        {status.value === 'IN_PROGRESS' && <Clock className="w-3 h-3" />}
                        {status.value === 'RESOLVED' && <CheckCircle className="w-3 h-3" />}
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(complaint)}
              className="tap-target"
            >
              <Eye className="w-3 h-3 mr-1" />
              ดู
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="loading-skeleton h-32 rounded-xl"></div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        ไม่พบเรื่องร้องเรียน
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        ไม่มีเรื่องร้องเรียนที่ตรงกับเงื่อนไขการค้นหา
      </p>
    </div>
  );
}

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

  const [previewAttachment, setPreviewAttachment] = useState<
    { url: string; filename: string } | null
  >(null);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in-scale safe-top safe-bottom">
      {previewAttachment && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewAttachment(null)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 tap-target z-10"
            >
              <X className="w-5 h-5" />
            </button>
            {/\.(png|jpe?g|gif|bmp|webp)$/i.test(previewAttachment.url) ? (
              <img
                src={previewAttachment.url}
                alt={previewAttachment.filename}
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <iframe
                src={previewAttachment.url}
                className="w-full h-[80vh] rounded-lg bg-white"
              />
            )}
          </div>
        </div>
      )}

      <Card className="w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col card-modern">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl truncate">{complaint.title}</CardTitle>
              <CardDescription className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="flex items-center">
                  <Hash className="w-4 h-4 mr-1" />
                  {complaint.trackingId}
                </span>
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(new Date(complaint.createdAt))}
                </span>
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 tap-target ml-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ประเภท</p>
              <CategoryBadge category={complaint.category} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">ความสำคัญ</p>
              <Badge className={getPriorityColor(complaint.priority)}>
                {getPriorityLabel(complaint.priority)}
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">สถานะ</p>
              <Select
                value={complaint.status}
                onValueChange={(value) => onUpdateStatus(complaint.id, value)}
              >
                <SelectTrigger className={`w-full ${getStatusColor(complaint.status)}`}>
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
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">อัพเดทล่าสุด</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {complaint.updatedAt ? formatDate(new Date(complaint.updatedAt)) : 'ไม่มีข้อมูล'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">รายละเอียด</p>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border">
              <p className="whitespace-pre-line text-gray-900 dark:text-gray-100 leading-relaxed">
                {complaint.description}
              </p>
            </div>
          </div>

          {complaint.attachments.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                ไฟล์แนับ ({complaint.attachments.length})
              </p>
              <div className="grid gap-3">
                {complaint.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {attachment.filename}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB • {attachment.fileType}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPreviewAttachment({ url: attachment.url, filename: attachment.filename })
                        }
                        className="tap-target"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline ml-1">เปิดดู</span>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="tap-target">
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span className="hidden sm:inline">ดาวน์โหลด</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {complaint.responses && complaint.responses.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                การตอบกลับ ({complaint.responses.length})
              </p>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {complaint.responses.map((response) => (
                  <div key={response.id} className={`p-4 rounded-xl border ${
                    response.isAdmin
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">
                          {response.isAdmin ? 'ผู้ดูแลระบบ' : 'ผู้ส่งเรื่อง'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(new Date(response.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {response.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    status: "all",
    category: "all",
    priority: "all",
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchComplaints();
  }, [currentPage, filters, itemsPerPage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === 'table') {
        setViewMode('card');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

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
        if (selectedComplaint?.id === id) {
          setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error) {
      console.error('Error updating complaint status:', error);
    }
  };

  const handleViewComplaint = async (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    try {
      const res = await fetch(`/api/admin/complaints/${complaint.id}`);
      if (res.ok) {
        const full = await res.json();
        setSelectedComplaint(full);
      }
    } catch (error) {
      console.error('Error fetching complaint details:', error);
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

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
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
      <div className="container-responsive py-6 sm:py-8">
        <div className="space-y-6">
          <div className="space-y-2 animate-pulse">
            <div className="h-8 loading-skeleton rounded w-64"></div>
            <div className="h-4 loading-skeleton rounded w-96"></div>
          </div>
          <div className="h-64 loading-skeleton rounded-xl"></div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-6 sm:py-8 space-y-6 sm:space-y-8">
      <div className="space-y-4 animate-slide-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="heading-responsive text-gray-900 dark:text-white">
              จัดการเรื่องร้องเรียน
            </h1>
            <p className="body-responsive text-gray-600 dark:text-gray-400 mt-2">
              ดูและจัดการเรื่องร้องเรียนทั้งหมดในระบบ • {totalCount.toLocaleString()} รายการ
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="hidden md:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <Button
                variant={viewMode === 'card' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('card')}
                className="tap-target"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="tap-target"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="tap-target"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">รีเฟรช</span>
            </Button>
            <Button variant="outline" size="sm" className="tap-target">
              <Download className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">ส่งออก</span>
            </Button>
          </div>
        </div>
      </div>

      <Card className="card-modern">
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
                className="text-gray-500 hover:text-gray-700 tap-target"
              >
                ล้างตัวกรอง
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="ค้นหาเรื่องร้องเรียน..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 input-modern"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

              <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 รายการ</SelectItem>
                  <SelectItem value="20">20 รายการ</SelectItem>
                  <SelectItem value="30">30 รายการ</SelectItem>
                  <SelectItem value="50">50 รายการ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {complaints.length === 0 ? (
        <Card className="card-modern">
          <CardContent>
            <EmptyState />
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'card' && (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onView={handleViewComplaint}
                  onUpdateStatus={updateComplaintStatus}
                />
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>
                  รายการเรื่องร้องเรียน ({complaints.length.toLocaleString()} รายการ)
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                                onClick={() => handleViewComplaint(complaint)}
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
              </CardContent>
            </Card>
          )}

          {totalPages > 1 && (
            <Card className="card-modern">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                    หน้า {currentPage} จาก {totalPages} • แสดง {complaints.length} จาก {totalCount.toLocaleString()} รายการ
                  </p>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="tap-target"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">ก่อนหน้า</span>
                    </Button>

                    <div className="hidden sm:flex items-center space-x-1">
                      {(() => {
                        const pages = [];
                        const startPage = Math.max(1, currentPage - 2);
                        const endPage = Math.min(totalPages, startPage + 4);

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <Button
                              key={i}
                              variant={currentPage === i ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(i)}
                              className="w-10 h-10 p-0"
                            >
                              {i}
                            </Button>
                          );
                        }
                        return pages;
                      })()}
                    </div>

                    <div className="sm:hidden px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm font-medium">
                      {currentPage} / {totalPages}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="tap-target"
                    >
                      <span className="hidden sm:inline">ถัดไป</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onUpdateStatus={updateComplaintStatus}
      />
    </div>
  );
}
