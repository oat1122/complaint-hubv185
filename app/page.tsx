import ComplaintForm from "@/components/form/ComplaintForm";
import { MessageCircle, Shield, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Complaint Hub</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a 
                href="/tracking" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ตรวจสอบสถานะ
              </a>
              <a 
                href="/dashboard" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                เข้าสู่ระบบ
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            ระบบเรื่องร้องเรียนแบบไม่เปิดเผยตัวตน
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            ส่งเรื่องร้องเรียนของท่านได้อย่างปลอดภัย เราจะดำเนินการอย่างรวดเร็วและเป็นธรรม
          </p>
          
          {/* Features */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">ปลอดภัย 100%</h3>
                <p className="text-gray-600">ไม่ต้องเปิดเผยตัวตน ข้อมูลของท่านจะถูกเก็บรักษาอย่างปลอดภัย</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">ง่ายดาย</h3>
                <p className="text-gray-600">กรอกฟอร์มง่ายๆ แนบไฟล์ได้ ได้รหัสติดตามทันที</p>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        <ComplaintForm />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2025 Complaint Hub. สงวนลิขสิทธิ์ทุกประการ
            </p>
            <p className="text-gray-400 text-sm mt-2">
              ระบบเรื่องร้องเรียนแบบไม่เปิดเผยตัวตน เพื่อการบริการที่ดีขึ้น
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
