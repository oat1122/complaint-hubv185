import ComplaintForm from "@/components/form/ComplaintForm";
import { MessageCircle, Shield, Clock, ArrowRight, CheckCircle, FileText, Search } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] via-[#fce4e4] to-[#ffeaea]">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-glass border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="p-2 bg-gradient-to-br from-[#ab1616] to-[#750c0c] rounded-xl shadow-soft">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Complaint Hub</h1>
            </div>
            <div className="flex items-center space-x-4 animate-slide-in">
              <Link 
                href="/tracking" 
                className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors hover-lift"
              >
                <Search className="w-4 h-4" />
                <span>ตรวจสอบสถานะ</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="flex items-center space-x-2 bg-gradient-primary text-white px-6 py-2.5 rounded-xl hover:shadow-medium transition-all duration-300 hover-lift font-medium"
              >
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16 animate-fade-in-scale">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              ระบบเรื่องร้องเรียน
              <span className="block bg-gradient-to-r from-[#ab1616] via-[#8a1111] to-[#750c0c] bg-clip-text text-transparent">
                แบบไม่เปิดเผยตัวตน
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed">
              ส่งเรื่องร้องเรียนของท่านได้อย่างปลอดภัย เราจะดำเนินการอย่างรวดเร็วและเป็นธรรม
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ปลอดภัย 100%</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ไม่เปิดเผยตัวตน</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>ตอบสนองรวดเร็ว</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Features */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white/70 backdrop-blur-glass p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover-lift animate-fade-in-scale border border-white/20" style={{ animationDelay: '100ms' }}>
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl w-fit mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">ปลอดภัย 100%</h3>
                <p className="text-gray-600 leading-relaxed">ไม่ต้องเปิดเผยตัวตน ข้อมูลของท่านจะถูกเก็บรักษาอย่างปลอดภัย ด้วยระบบเข้ารหัสขั้นสูง</p>
              </div>
              
              <div className="group bg-white/70 backdrop-blur-glass p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover-lift animate-fade-in-scale border border-white/20" style={{ animationDelay: '200ms' }}>
                <div className="p-4 bg-gradient-to-br from-[#ab1616] to-[#750c0c] rounded-2xl w-fit mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">ง่ายดาย</h3>
                <p className="text-gray-600 leading-relaxed">กรอกฟอร์มง่ายๆ แนบไฟล์ได้ ได้รหัสติดตามทันที พร้อมระบบแจ้งเตือนความคืบหน้า</p>
              </div>
              
              <div className="group bg-white/70 backdrop-blur-glass p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 hover-lift animate-fade-in-scale border border-white/20" style={{ animationDelay: '300ms' }}>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-fit mx-auto mb-6 shadow-soft group-hover:scale-110 transition-transform">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">รวดเร็ว</h3>
                <p className="text-gray-600 leading-relaxed">ระบบตอบสนองรวดเร็ว ติดตามสถานะได้ตลอดเวลา พร้อมการแจ้งเตือนแบบเรียลไทม์</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Complaint Form Section */}
        <div className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <ComplaintForm />
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-[#ab1616] to-[#750c0c] rounded-xl shadow-soft">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">Complaint Hub</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">การบริการ</h4>
                <p className="text-gray-300 text-sm">ระบบรับเรื่องร้องเรียนออนไลน์</p>
                <p className="text-gray-300 text-sm">ติดตามสถานะแบบเรียลไทม์</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">ความปลอดภัย</h4>
                <p className="text-gray-300 text-sm">เข้ารหัสข้อมูลขั้นสูง</p>
                <p className="text-gray-300 text-sm">ไม่เก็บข้อมูลส่วนตัว</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-primary">การสนับสนุน</h4>
                <p className="text-gray-300 text-sm">ระบบช่วยเหลือ 24/7</p>
                <p className="text-gray-300 text-sm">คู่มือการใช้งาน</p>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-8 space-y-4">
              <p className="text-gray-300">
                © 2025 Complaint Hub. สงวนลิขสิทธิ์ทุกประการ
              </p>
              <p className="text-gray-400 text-sm">
                ระบบเรื่องร้องเรียนแบบไม่เปิดเผยตัวตน เพื่อการบริการที่ดีขึ้น
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
