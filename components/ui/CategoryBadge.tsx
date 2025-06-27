import { Badge } from "@/components/ui/badge";
import { COMPLAINT_CATEGORIES } from "@/lib/constants";

interface CategoryBadgeProps {
  category: string;
  variant?: "default" | "secondary" | "outline";
}

export function CategoryBadge({ category, variant = "default" }: CategoryBadgeProps) {
  const categoryData = COMPLAINT_CATEGORIES.find(c => c.value === category);
  
  if (!categoryData) return null;

  const colorMap = {
    TECHNICAL: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    PERSONNEL: "bg-purple-100 text-purple-800 hover:bg-purple-200", 
    ENVIRONMENT: "bg-green-100 text-green-800 hover:bg-green-200",
    EQUIPMENT: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    SAFETY: "bg-red-100 text-red-800 hover:bg-red-200",
    FINANCIAL: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    STRUCTURE_SYSTEM: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    WELFARE_SERVICES: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    PROJECT_IDEA: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    OTHER: "bg-gray-100 text-gray-800 hover:bg-gray-200"
  };

  return (
    <Badge 
      variant={variant}
      className={`${colorMap[category as keyof typeof colorMap]} transition-colors`}
    >
      {categoryData.label}
    </Badge>
  );
}
