"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { MessageCircle, Search, FileText, Calendar, AlertCircle } from "lucide-react";
import { formatDate, getPriorityColor, getStatusColor, getPriorityLabel, getStatusLabel } from "@/lib/utils";

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

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!trackingId.trim()) {
      setError("กรุณาระบุรหัสติดตาม");
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await fetch(`/api/complaints?trackingId=${trackingId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      setComplaint(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryText = (category: string) => {
    return <CategoryBadge category={category} />;
  };

  const getPriorityText = (priority: string) => {
    return (
      <Badge className={getPriorityColor(priority)}>
        {getPriorityLabel(priority)}
      </Badge>
    );
  };

  const getStatusText = (status: string) => {
    return getStatusLabel(status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] to-[#ffeaea]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">Complaint Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="text-primary hover:text-primary/80 font-medium"
              >
                ส่งเรื่องร้องเรียน
              </a>
              <a
                href="/dashboard"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                เข้าสู่ระบบ
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-6 h-6" />
              <span>ตรวจสอบสถานะเรื่องร้องเรียน</span>
            </CardTitle>
            <CardDescription>
              กรอกรหัสติดตามเพื่อตรวจสอบสถานะเรื่องร้องเรียนของท่าน
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                placeholder="กรอกรหัสติดตาม เช่น TRK-ABC123"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? "กำลังค้นหา..." : "ค้นหา"}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Complaint Details */}
        {complaint && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{complaint.title}</CardTitle>
                <Badge className={getStatusColor(complaint.status)}>
                  {getStatusText(complaint.status)}
                </Badge>
              </div>
              <CardDescription>
                รหัสติดตาม: {complaint.trackingId}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">หมวดหมู่</p>
                  <div>{getCategoryText(complaint.category)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">ระดับความสำคัญ</p>
                  <div>{getPriorityText(complaint.priority)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">วันที่ส่ง</p>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(new Date(complaint.createdAt))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">รายละเอียด</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-line">{complaint.description}</p>
                </div>
              </div>

              {/* Attachments */}
              {complaint.attachments && complaint.attachments.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">ไฟล์แนบ</p>
                  <div className="space-y-2">
                    {complaint.attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium">{attachment.filename}</p>
                            <p className="text-xs text-gray-500">
                              {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          ดาวน์โหลด
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Progress */}
              <div>
                <p className="text-sm font-medium text-gray-600 mb-3">ความคืบหน้า</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-blue-600 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">ได้รับเรื่องร้องเรียน</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(new Date(complaint.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  {complaint.status !== "NEW" && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-yellow-600 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">กำลังดำเนินการ</p>
                      </div>
                    </div>
                  )}
                  
                  {(complaint.status === "RESOLVED" || complaint.status === "CLOSED") && (
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-green-600 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">ดำเนินการเสร็จสิ้น</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Help Text */}
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-medium text-primary mb-2">ข้อมูลเพิ่มเติม</h4>
                <ul className="text-sm text-primary/80 space-y-1">
                  <li>• เราจะติดต่อกลับภายใน 3-5 วันทำการ</li>
                  <li>• หากต้องการข้อมูลเพิ่มเติม กรุณาส่งเรื่องร้องเรียนใหม่</li>
                  <li>• เก็บรหัสติดตามนี้ไว้เพื่อตรวจสอบสถานะ</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
