import ComplaintForm from "@/components/form/ComplaintForm";
import { MessageCircle, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] via-[#fce4e4] to-[#ffeaea]">
      <header className="glass-card-light sticky top-0 z-50 safe-top">
        <div className="container-responsive py-4">
          <div className="flex-responsive justify-between">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-soft hover-glow">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Complaint Hub</h1>
                <p className="text-xs text-gray-600 hidden sm:block">ระบบรับเรื่องร้องเรียนที่ปลอดภัย</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 animate-slide-in">
              <Link href="/tracking" className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors hover-lift tap-target">
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">ตรวจสอบสถานะ</span>
                <span className="sm:hidden">ติดตาม</span>
              </Link>
              <Link href="/dashboard" className="btn-primary px-3 sm:px-6 py-2.5 rounded-xl tap-target">
                <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                <span className="sm:hidden">Login</span>
                <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="container-responsive py-8">
        <p className="text-center text-gray-700 mb-8">
          แบบฟอร์มเรื่องร้องเรียน กรุณากรอกข้อมูลเรื่องร้องเรียนของท่านให้ครบถ้วน และ ระบบเรื่องร้องเรียนแบบไม่เปิดเผยตัวตน ส่งเรื่องร้องเรียนของท่านได้อย่างปลอดภัย เราจะดำเนินการอย่างรวดเร็วและเป็นธรรม
        </p>
        <ComplaintForm />
      </main>
    </div>
  );
}
