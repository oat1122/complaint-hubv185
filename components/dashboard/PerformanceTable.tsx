import { getCategoryDisplayName, calculatePerformanceScore } from '@/lib/analytics-utils';
import { SortAsc, SortDesc } from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '@/lib/constants';

interface PerformanceData {
  category: string;
  totalCount: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  avgResolutionTime: number;
  resolutionRate: number;
}

interface Props {
  data: PerformanceData[];
  onSort: (column: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const columns = [
  { key: 'category', label: 'ประเภท' },
  { key: 'totalCount', label: 'ทั้งหมด' },
  { key: 'newCount', label: 'ใหม่' },
  { key: 'inProgressCount', label: 'กำลังดำเนินการ' },
  { key: 'resolvedCount', label: 'แก้ไขแล้ว' },
  { key: 'resolutionRate', label: 'อัตราการแก้ไข' },
  { key: 'avgResolutionTime', label: 'เวลาเฉลี่ย (ชม.)' },
  { key: 'score', label: 'ประสิทธิภาพ' },
];

export function PerformanceTable({ data, onSort, sortBy, sortOrder }: Props) {
  const handleSort = (column: string) => {
    onSort(column);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className="cursor-pointer hover:bg-gray-50 p-3 text-left"
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortBy === column.key && (
                    sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const display = getCategoryDisplayName(item.category);
            const score = calculatePerformanceScore(item.resolutionRate, item.avgResolutionTime);
            return (
              <tr key={item.category} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-3">{display}</td>
                <td className="text-right p-3 font-semibold">{item.totalCount}</td>
                <td className="text-right p-3 text-blue-600">{item.newCount}</td>
                <td className="text-right p-3 text-yellow-600">{item.inProgressCount}</td>
                <td className="text-right p-3 text-green-600">{item.resolvedCount}</td>
                <td className="text-right p-3">{item.resolutionRate}%</td>
                <td className="text-right p-3">{Math.round(item.avgResolutionTime)}</td>
                <td className="text-center p-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                    score > 80 ? 'bg-green-500' : score > 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>{score}</div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
