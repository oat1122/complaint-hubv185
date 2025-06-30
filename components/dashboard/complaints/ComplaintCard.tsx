import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  Paperclip,
  X,
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

export function ComplaintCard({
  complaint,
  onView,
  onUpdateStatus,
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
              <X className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
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
