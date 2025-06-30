"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import {
  MessageCircle,
  Search,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  Share2,
  Copy,
  ExternalLink,
  ArrowRight,
  Home,
  QrCode,
  Bell,
  Shield,
  Zap,
  Smartphone
} from "lucide-react";
import { formatDate, getPriorityColor, getStatusColor, getPriorityLabel, getStatusLabel } from "@/lib/utils";
import { toast } from "sonner";
import { Complaint } from "@/components/dashboard/complaints";

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState("");
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("trackingHistory");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const handleSearch = async (id?: string) => {
    const targetId = id ?? trackingId;
    if (!targetId.trim()) {
      setError("กรุณาระบุรหัสติดตาม");
      return;
    }

    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const response = await fetch(`/api/complaints?trackingId=${targetId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "เกิดข้อผิดพลาด");
      }

      setComplaint(data);
      const newHistory = [targetId, ...history.filter((h) => h !== targetId)].slice(0, 5);
      setHistory(newHistory);
      localStorage.setItem("trackingHistory", JSON.stringify(newHistory));
      toast.success("พบข้อมูลเรื่องร้องเรียนแล้ว");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTrackingId = async () => {
    if (complaint) {
      try {
        await navigator.clipboard.writeText(complaint.trackingId);
        toast.success("คัดลอกรหัสติดตามแล้ว");
      } catch (err) {
        toast.error("ไม่สามารถคัดลอกได้");
      }
    }
  };

  const handleShare = async () => {
    if (complaint && navigator.share) {
      try {
        await navigator.share({
          title: 'ติดตามเรื่องร้องเรียน',
          text: `ติดตามเรื่องร้องเรียน: ${complaint.title}`,
          url: `${window.location.origin}/tracking?id=${complaint.trackingId}`
        });
      } catch (err) {
        handleCopyTrackingId();
      }
    } else {
      handleCopyTrackingId();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'IN_PROGRESS':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'RESOLVED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CLOSED':
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'NEW': return 25;
      case 'IN_PROGRESS': return 50;
      case 'RESOLVED': return 100;
      case 'CLOSED': return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] via-[#fce4e4] to-[#ffeaea] safe-top safe-bottom">
      <header className="glass-card-light sticky top-0 z-50">
        <div className="container-responsive py-4">
          <div className="flex-responsive justify-between">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-soft">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Complaint Hub</h1>
                <p className="text-xs text-gray-600 hidden sm:block">ติดตามสถานะเรื่องร้องเรียน</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4 animate-slide-in">
              <a
                href="/"
                className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors hover-lift tap-target"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">หน้าแรก</span>
              </a>
              <a
                href="/dashboard"
                className="btn-primary px-3 sm:px-6 py-2.5 rounded-xl tap-target"
              >
                <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                <span className="sm:hidden">Login</span>
                <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-scale">
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <h2 className="heading-responsive text-gray-900">
                ตรวจสอบสถานะเรื่องร้องเรียน
              </h2>
              <p className="body-responsive text-gray-600 max-w-2xl mx-auto">
                ใส่รหัสติดตามเพื่อดูสถานะและความคืบหน้าของเรื่องร้องเรียนของท่าน
              </p>
            </div>

            <div className="flex justify-center items-center space-x-6 sm:space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm">ปลอดภัย</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-orange-500" />
                <span className="text-sm">เรียลไทม์</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5 text-blue-500" />
                <span className="text-sm">ใช้ง่าย</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="card-modern mb-8 animate-slide-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-6 h-6" />
              <span>ค้นหาด้วยรหัสติดตาม</span>
            </CardTitle>
            <CardDescription>
              กรอกรหัสติดตามที่ได้รับเมื่อส่งเรื่องร้องเรียน
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="กรอกรหัสติดตาม เช่น TRK-ABC123"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-modern pr-12"
                  disabled={loading}
                />
                <div className="absolute right-3 top-3">
                  <QrCode className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <Button
                onClick={() => handleSearch()}
                disabled={loading || !trackingId.trim()}
                className="btn-primary tap-target sm:px-8"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ค้นหา...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    ค้นหา
                  </>
                )}
              </Button>
            </div>

            {history.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <p>รหัสที่เคยค้นหา:</p>
                <div className="flex flex-wrap gap-2">
                  {history.map((id) => (
                    <button
                      key={id}
                      onClick={() => handleSearch(id)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      {id}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="animate-slide-in">
                <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                เคล็ดลับการใช้งาน
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• รหัสติดตามจะขึ้นต้นด้วย "TRK-"</li>
                <li>• สามารถคัดลอกรหัสจากอีเมลที่ได้รับ</li>
                <li>• ติดตามได้ตลอด 24 ชั่วโมง</li>
                <li>• ข้อมูลอัพเดทแบบเรียลไทม์</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {complaint && (
          <div className="animate-fade-in-scale space-y-6 sm:space-y-8">
            <Card className="card-modern bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        {complaint.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-mono text-sm">
                          {complaint.trackingId}
                        </Badge>
                        <Badge className={getStatusColor(complaint.status)}>
                          {getStatusLabel(complaint.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleCopyTrackingId}
                        variant="outline"
                        size="sm"
                        className="tap-target"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">คัดลอก</span>
                      </Button>
                      <Button
                        onClick={handleShare}
                        variant="outline"
                        size="sm"
                        className="tap-target"
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">แชร์</span>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">ความคืบหน้า</span>
                      <span className="text-gray-500 dark:text-gray-400">{getProgressPercentage(complaint.status)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${getProgressPercentage(complaint.status)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle>ข้อมูลเบื้องต้น</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">หมวดหมู่</p>
                        <CategoryBadge category={complaint.category} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">ระดับความสำคัญ</p>
                        <Badge className={getPriorityColor(complaint.priority)}>
                          {getPriorityLabel(complaint.priority)}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">วันที่ส่ง</p>
                        <div className="flex items-center text-gray-900 dark:text-white">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="text-sm">{formatDate(new Date(complaint.createdAt))}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle>รายละเอียด</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-xl border">
                      <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line leading-relaxed">
                        {complaint.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {complaint.attachments && complaint.attachments.length > 0 && (
                  <Card className="card-modern">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>ไฟล์แนบ ({complaint.attachments.length})</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {complaint.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                            <div className="flex items-center space-x-3 flex-1 min-w-0">
                              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg flex-shrink-0">
                                <FileText className="w-5 h-5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {attachment.filename}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                              <Button variant="outline" size="sm" asChild className="tap-target group-hover:bg-primary group-hover:text-white transition-colors">
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
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card className="card-modern">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>ความคืบหน้า</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">ได้รับเรื่องร้องเรียน</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(new Date(complaint.createdAt))}
                            </p>
                          </div>
                        </div>

                        {complaint.status !== "NEW" && (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">กำลังดำเนินการ</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                เจ้าหน้าที่กำลังตรวจสอบ
                              </p>
                            </div>
                          </div>
                        )}

                        {(complaint.status === "RESOLVED" || complaint.status === "CLOSED") && (
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">ดำเนินการเสร็จสิ้น</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                แก้ไขปัญหาเรียบร้อยแล้ว
                              </p>
                            </div>
                          </div>
                        )}

                        {complaint.status === "NEW" && (
                          <div className="flex items-center space-x-3 opacity-50">
                            <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">รอการดำเนินการ</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mt-6">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">ระยะเวลาที่คาดหวัง</h4>
                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                          <li>• รับเรื่อง: ทันที</li>
                          <li>• ตรวจสอบ: 1-2 วันทำการ</li>
                          <li>• ดำเนินการ: 3-7 วันทำการ</li>
                          <li>• แจ้งผล: ภายใน 2 สัปดาห์</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="card-modern bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <Bell className="w-4 h-4 mr-2" />
                      ข้อมูลเพิ่มเติม
                    </h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>ระบบจะส่งการแจ้งเตือนเมื่อมีการอัพเดท</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>สามารถติดตามได้ตลอด 24 ชั่วโมง</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>เก็บรหัสติดตามนี้ไว้สำหรับอ้างอิง</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>ข้อมูลทั้งหมดถูกเข้ารหัสและปลอดภัย</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {!complaint && !loading && (
          <div className="text-center py-12 animate-fade-in-scale">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  ยังไม่ได้ค้นหาหรือไม่พบข้อมูล
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                  กรอกรหัสติดตามที่ได้รับเมื่อส่งเรื่องร้องเรียน หรือส่งเรื่องร้องเรียนใหม่
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-primary tap-target">
                  <a href="/">
                    <FileText className="w-4 h-4 mr-2" />
                    ส่งเรื่องร้องเรียนใหม่
                  </a>
                </Button>
                <Button variant="outline" asChild className="tap-target">
                  <a href="/">
                    <Home className="w-4 h-4 mr-2" />
                    กลับหน้าแรก
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
