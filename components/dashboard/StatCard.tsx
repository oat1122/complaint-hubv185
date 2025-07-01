import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconClass?: string;
  description?: React.ReactNode;
}

export function StatCard({ title, value, icon: Icon, iconClass = '', description }: StatCardProps) {
  return (
    <Card className="card-modern">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {value}
            </div>
            {description && <div className="mt-1 text-xs">{description}</div>}
          </div>
          <div className={`p-3 rounded-xl ${iconClass}`}> 
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
