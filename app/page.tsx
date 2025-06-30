import ComplaintForm from "@/components/form/ComplaintForm";
import { MessageCircle, Search, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] via-[#fce4e4] to-[#ffeaea] overflow-hidden">
      <header className="glass-card-light sticky top-0 z-50 safe-top">
        <div className="container-responsive py-4">
          <div className="flex-responsive justify-between">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="p-2 bg-white border border-primary rounded-xl shadow-soft hover-glow">
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

      <main className="container-responsive py-8 sm:py-12 space-y-8">
        <div className="text-center animate-fade-in-scale space-y-4">
          <h2 className="heading-responsive text-gray-900">
            ระบบเรื่องร้องเรียน
            <span className="block text-gradient-primary mt-2">แบบไม่เปิดเผยตัวตน</span>
          </h2>
          <p className="body-responsive text-gray-600">
            ส่งเรื่องร้องเรียนของท่านได้อย่างปลอดภัย เราจะดำเนินการอย่างรวดเร็วและเป็นธรรม
          </p>
        </div>

        <div className="animate-slide-in">
          <ComplaintForm />
        </div>
      </main>
    </div>
  );
}
