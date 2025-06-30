import { Hash } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Hash className="w-8 h-8 text-gray-400" />
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
