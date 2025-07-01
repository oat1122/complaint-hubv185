import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function RetryButton({ onRetry, loading }: { onRetry: () => void; loading?: boolean }) {
  return (
    <Button onClick={onRetry} disabled={loading} className="tap-target">
      <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
      ลองใหม่
    </Button>
  );
}
