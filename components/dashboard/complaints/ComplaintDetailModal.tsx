import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  FileText,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  Hash,
  X,
  User,
  ExternalLink,
  Download,
} from "lucide-react";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
  getPriorityLabel,
  getStatusLabel,
} from "@/lib/utils";
import { STATUS_LEVELS } from "@/lib/constants";
import type { Complaint } from "./types";

export function ComplaintDetailModal({
  complaint,
  onClose,
  onUpdateStatus,
}: {
  complaint: Complaint | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const [previewAttachment, setPreviewAttachment] = useState<
    { url: string; filename: string } | null
  >(null);

  if (!complaint) return null;

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
                className="w-full h-[80vh] rounded-lg bg-gray-50 dark:bg-gray-900"
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
