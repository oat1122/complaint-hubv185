import React from 'react';
import { MessageSquare } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = 'ไม่พบเรื่องร้องเรียน',
  description = 'ไม่มีเรื่องร้องเรียนที่ตรงกับเงื่อนไขการค้นหา'
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

export default EmptyState;
