import { useState, useMemo } from "react";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";
import { SortAsc, SortDesc } from "lucide-react";

interface PerformanceItem {
  category: string;
  totalCount: number;
  newCount: number;
  inProgressCount: number;
  resolvedCount: number;
  avgResolutionTime: number;
  resolutionRate: number;
}

interface PerformanceTableProps {
  data: PerformanceItem[];
}

type SortField =
  | "totalCount"
  | "newCount"
  | "inProgressCount"
  | "resolvedCount"
  | "resolutionRate"
  | "avgResolutionTime"
  | "performance";

type SortOrder = "asc" | "desc";

export function PerformanceTable({ data }: PerformanceTableProps) {
  const [sortField, setSortField] = useState<SortField>("resolutionRate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sortedData = useMemo(() => {
    const getPerformance = (item: PerformanceItem) =>
      Math.round(
        (item.resolutionRate +
          (100 - Math.min((item.avgResolutionTime / 24) * 100, 100))) /
          2
      );

    const mapped = data.map((d) => ({ ...d, performance: getPerformance(d) }));

    return mapped.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const renderIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <SortAsc className="w-4 h-4" />
    ) : (
      <SortDesc className="w-4 h-4" />
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left p-3 font-medium">ประเภท</th>
            <th
              className="text-right p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("totalCount")}
            >
              <div className="flex justify-end items-center space-x-1">
                <span>ทั้งหมด</span>
                {renderIndicator("totalCount")}
              </div>
            </th>
            <th
              className="text-right p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("newCount")}
            >
              <div className="flex justify-end items-center space-x-1">
                <span>ใหม่</span>
                {renderIndicator("newCount")}
              </div>
            </th>
            <th
              className="text-right p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("inProgressCount")}
            >
              <div className="flex justify-end items-center space-x-1">
                <span>กำลังดำเนินการ</span>
                {renderIndicator("inProgressCount")}
              </div>
            </th>
            <th
              className="text-right p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("resolvedCount")}
            >
              <div className="flex justify-end items-center space-x-1">
                <span>แก้ไขแล้ว</span>
                {renderIndicator("resolvedCount")}
              </div>
            </th>
            <th
              className="text-right p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("resolutionRate")}
            >
              <div className="flex justify-end items-center space-x-1">
                <span>อัตราการแก้ไข</span>
                {renderIndicator("resolutionRate")}
              </div>
            </th>
            <th
              className="text-right p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("avgResolutionTime")}
            >
              <div className="flex justify-end items-center space-x-1">
                <span>เวลาเฉลี่ย (ชม.)</span>
                {renderIndicator("avgResolutionTime")}
              </div>
            </th>
            <th
              className="text-center p-3 font-medium cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              onClick={() => handleSort("performance")}
            >
              <div className="flex justify-center items-center space-x-1">
                <span>ประสิทธิภาพ</span>
                {renderIndicator("performance")}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => {
            const categoryInfo = COMPLAINT_CATEGORIES.find(
              (c) => c.value === item.category
            );
            const performance = item.performance as number;
            return (
              <tr
                key={item.category}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    {categoryInfo && (
                      <categoryInfo.icon className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {categoryInfo?.label || item.category}
                    </span>
                  </div>
                </td>
                <td className="text-right p-3 font-semibold">
                  {item.totalCount}
                </td>
                <td className="text-right p-3 text-blue-600">{item.newCount}</td>
                <td className="text-right p-3 text-yellow-600">
                  {item.inProgressCount}
                </td>
                <td className="text-right p-3 text-green-600">
                  {item.resolvedCount}
                </td>
                <td className="text-right p-3">
                  <span
                    className={`font-semibold ${
                      item.resolutionRate > 80
                        ? "text-green-600"
                        : item.resolutionRate > 60
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.resolutionRate}%
                  </span>
                </td>
                <td className="text-right p-3">
                  <span
                    className={`${
                      item.avgResolutionTime < 24
                        ? "text-green-600"
                        : item.avgResolutionTime < 72
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {Math.round(item.avgResolutionTime)}
                  </span>
                </td>
                <td className="text-center p-3">
                  <div className="flex items-center justify-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        performance > 80
                          ? "bg-green-500"
                          : performance > 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {performance}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
