import ComplaintForm from "@/components/form/ComplaintForm";
import { 
  MessageCircle, 
  Shield, 
  Clock, 
  ArrowRight, 
  CheckCircle, 
  FileText, 
  Search,
  Star,
  Users,
  Award,
  TrendingUp,
  Smartphone,
  Globe,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbf5f5] via-[#fce4e4] to-[#ffeaea] overflow-hidden">
      {/* Enhanced Header with Mobile Navigation */}
      <header className="glass-card-light sticky top-0 z-50 safe-top">
        <div className="container-responsive py-4">
          <div className="flex-responsive justify-between">
            <div className="flex items-center space-x-3 animate-slide-in-left">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-soft hover-glow">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Complaint Hub</h1>
                <p className="text-xs text-gray-600 hidden sm:block">ระบบรับเรื่องร้องเรียนที่ปลอดภัย</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4 animate-slide-in">
              <Link 
                href="/tracking" 
                className="flex items-center space-x-2 text-primary hover:text-primary/80 font-medium transition-colors hover-lift tap-target"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">ตรวจสอบสถานะ</span>
                <span className="sm:hidden">ติดตาม</span>
              </Link>
              <Link 
                href="/dashboard" 
                className="btn-primary px-3 sm:px-6 py-2.5 rounded-xl tap-target"
              >
                <span className="hidden sm:inline">เข้าสู่ระบบ</span>
                <span className="sm:hidden">Login</span>
                <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Main Content */}
      <main className="container-responsive py-8 sm:py-12">
        {/* Hero Section with Mobile-First Design */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-scale">
          <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <h2 className="heading-responsive text-gray-900 leading-tight">
                ระบบเรื่องร้องเรียน
                <span className="block text-gradient-primary mt-2">
                  แบบไม่เปิดเผยตัวตน
                </span>
              </h2>
              <p className="body-responsive text-gray-600 leading-relaxed max-w-3xl mx-auto">
                ส่งเรื่องร้องเรียนของท่านได้อย่างปลอดภัย เราจะดำเนินการอย่างรวดเร็วและเป็นธรรม
              </p>
            </div>
            
            {/* Trust Indicators - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 text-sm text-gray-600 mb-8 sm:mb-12">
              <div className="flex items-center justify-center space-x-2 p-3 sm:p-0">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>ปลอดภัย 100%</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 sm:p-0">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>ไม่เปิดเผยตัวตน</span>
              </div>
              <div className="flex items-center justify-center space-x-2 p-3 sm:p-0">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>ตอบสนองรวดเร็ว</span>
              </div>
            </div>

            {/* Statistics Showcase */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="card-modern p-4 sm:p-6 text-center animate-bounce-gentle" style={{ animationDelay: '0.1s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">1,500+</div>
                <div className="text-xs sm:text-sm text-gray-600">เรื่องร้องเรียน</div>
              </div>
              <div className="card-modern p-4 sm:p-6 text-center animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">98%</div>
                <div className="text-xs sm:text-sm text-gray-600">อัตราแก้ไข</div>
              </div>
              <div className="card-modern p-4 sm:p-6 text-center animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">24</div>
                <div className="text-xs sm:text-sm text-gray-600">ชั่วโมง</div>
              </div>
              <div className="card-modern p-4 sm:p-6 text-center animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">5</div>
                <div className="text-xs sm:text-sm text-gray-600">ดาว</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Features Grid - Mobile Optimized */}
          <div className="max-w-6xl mx-auto mb-12 sm:mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="group card-interactive p-6 sm:p-8 animate-fade-in-scale" style={{ animationDelay: '100ms' }}>
                <div className="mb-6">
                  <div className="p-4 bg-gradient-success rounded-2xl w-fit mx-auto mb-4 shadow-soft group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="subheading-responsive mb-4 text-gray-900">ปลอดภัย 100%</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ไม่ต้องเปิดเผยตัวตน ข้อมูลของท่านจะถูกเก็บรักษาอย่างปลอดภัย ด้วยระบบเข้ารหัสขั้นสูง
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">เรียนรู้เพิ่มเติม</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              
              <div className="group card-interactive p-6 sm:p-8 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
                <div className="mb-6">
                  <div className="p-4 bg-gradient-primary rounded-2xl w-fit mx-auto mb-4 shadow-soft group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="subheading-responsive mb-4 text-gray-900">ง่ายดาย</h3>
                  <p className="text-gray-600 leading-relaxed">
                    กรอกฟอร์มง่ายๆ แนบไฟล์ได้ ได้รหัสติดตามทันที พร้อมระบบแจ้งเตือนความคืบหน้า
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">เรียนรู้เพิ่มเติม</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              
              <div className="group card-interactive p-6 sm:p-8 animate-fade-in-scale sm:col-span-2 lg:col-span-1" style={{ animationDelay: '300ms' }}>
                <div className="mb-6">
                  <div className="p-4 bg-gradient-warning rounded-2xl w-fit mx-auto mb-4 shadow-soft group-hover:shadow-glow group-hover:scale-110 transition-all duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="subheading-responsive mb-4 text-gray-900">รวดเร็ว</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ระบบตอบสนองรวดเร็ว ติดตามสถานะได้ตลอดเวลา พร้อมการแจ้งเตือนแบบเรียลไทม์
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">เรียนรู้เพิ่มเติม</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps - Mobile Optimized */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="subheading-responsive text-gray-900 mb-4">ขั้นตอนการใช้งาน</h3>
            <p className="body-responsive text-gray-600">เพียง 3 ขั้นตอนง่ายๆ</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-slide-in" style={{ animationDelay: '100ms' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto shadow-large hover-glow">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">กรอกข้อมูล</h4>
              <p className="text-gray-600 text-sm">กรอกรายละเอียดเรื่องร้องเรียนและแนบไฟล์หลักฐาน</p>
            </div>
            
            <div className="text-center animate-slide-in" style={{ animationDelay: '200ms' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-success rounded-full flex items-center justify-center mx-auto shadow-large hover-glow">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">ติดตามสถานะ</h4>
              <p className="text-gray-600 text-sm">ใช้รหัสติดตามเพื่อตรวจสอบความคืบหน้า</p>
            </div>
            
            <div className="text-center animate-slide-in" style={{ animationDelay: '300ms' }}>
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-warning rounded-full flex items-center justify-center mx-auto shadow-large hover-glow">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">รับการแก้ไข</h4>
              <p className="text-gray-600 text-sm">รอรับการแก้ไขและผลตอบกลับ</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section - Mobile Optimized */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="subheading-responsive text-gray-900 mb-4">ความเห็นจากผู้ใช้งาน</h3>
            <p className="body-responsive text-gray-600">ผู้ใช้งานให้ความไว้วางใจเรามาอย่างต่อเนื่อง</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="card-modern p-6 animate-fade-in-scale" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"ระบบใช้งานง่าย ปลอดภัย และตอบสนองรวดเร็วมาก"</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">ผู้ใช้งาน A</div>
                  <div className="text-sm text-gray-500">พนักงานบริษัท</div>
                </div>
              </div>
            </div>
            
            <div className="card-modern p-6 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"ไม่ต้องเปิดเผยตัวตน รู้สึกปลอดภัยในการร้องเรียน"</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">ผู้ใช้งาน B</div>
                  <div className="text-sm text-gray-500">นักเรียน</div>
                </div>
              </div>
            </div>
            
            <div className="card-modern p-6 animate-fade-in-scale sm:col-span-2 lg:col-span-1" style={{ animationDelay: '300ms' }}>
              <div className="flex items-center mb-4">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">"ติดตามสถานะได้แบบเรียลไทม์ ประทับใจมาก"</p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <div className="font-medium text-gray-900">ผู้ใช้งาน C</div>
                  <div className="text-sm text-gray-500">ประชาชนทั่วไป</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form Section - Mobile Optimized */}
        <div className="animate-slide-in" style={{ animationDelay: '400ms' }}>
          <ComplaintForm />
        </div>

        {/* Additional Features - Mobile Optimized */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="subheading-responsive text-gray-900 mb-4">ทำไมต้องเลือกเรา</h3>
            <p className="body-responsive text-gray-600">คุณสมบัติที่ทำให้เราแตกต่าง</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 animate-fade-in-scale" style={{ animationDelay: '100ms' }}>
              <Smartphone className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Mobile-Friendly</h4>
              <p className="text-gray-600 text-sm">ใช้งานได้ลื่นบนมือถือ</p>
            </div>
            
            <div className="text-center p-6 animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">เข้าถึงได้ทุกที่</h4>
              <p className="text-gray-600 text-sm">ใช้งานได้ตลอด 24/7</p>
            </div>
            
            <div className="text-center p-6 animate-fade-in-scale" style={{ animationDelay: '300ms' }}>
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">ประมวลผลเร็ว</h4>
              <p className="text-gray-600 text-sm">ระบบตอบสนองทันที</p>
            </div>
            
            <div className="text-center p-6 animate-fade-in-scale" style={{ animationDelay: '400ms' }}>
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">ได้รับรางวัล</h4>
              <p className="text-gray-600 text-sm">ระบบที่ได้รับการยอมรับ</p>
            </div>
          </div>
        </div>
      </main>

      {/* Enhanced Footer - Mobile Optimized */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12 sm:py-16 mt-16 sm:mt-24 safe-bottom">
        <div className="container-responsive">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-soft">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-xl sm:text-2xl font-bold">Complaint Hub</h3>
                <p className="text-sm text-gray-300">ระบบรับเรื่องร้องเรียนที่ปลอดภัย</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
              <div className="space-y-3">
                <h4 className="font-semibold text-primary text-lg">การบริการ</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">ระบบรับเรื่องร้องเรียนออนไลน์</p>
                  <p className="text-gray-300">ติดตามสถานะแบบเรียลไทม์</p>
                  <p className="text-gray-300">รายงานและสถิติ</p>
                  <p className="text-gray-300">ระบบแจ้งเตือน</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary text-lg">ความปลอดภัย</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">เข้ารหัสข้อมูลขั้นสูง</p>
                  <p className="text-gray-300">ไม่เก็บข้อมูลส่วนตัว</p>
                  <p className="text-gray-300">ระบบสำรองข้อมูล</p>
                  <p className="text-gray-300">การตรวจสอบสิทธิ์</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-primary text-lg">การสนับสนุน</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">ระบบช่วยเหลือ 24/7</p>
                  <p className="text-gray-300">คู่มือการใช้งาน</p>
                  <p className="text-gray-300">FAQ และ Q&A</p>
                  <p className="text-gray-300">ติดต่อทีมงาน</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 sm:pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <p className="text-gray-300 text-sm">
                  © 2025 Complaint Hub. สงวนลิขสิทธิ์ทุกประการ
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <a href="#" className="text-gray-300 hover:text-primary transition-colors">นโยบายความเป็นส่วนตัว</a>
                  <a href="#" className="text-gray-300 hover:text-primary transition-colors">เงื่อนไขการใช้งาน</a>
                </div>
              </div>
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
