import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartSkeleton } from './ChartSkeleton';
import { ReactNode } from 'react';

interface ChartContainerProps {
  title: string;
  description?: string;
  loading?: boolean;
  children: ReactNode;
}

export function ChartContainer({ title, description, children, loading }: ChartContainerProps) {
  return (
    <Card className="card-modern">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{title}</span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {loading ? <ChartSkeleton /> : children}
      </CardContent>
    </Card>
  );
}
