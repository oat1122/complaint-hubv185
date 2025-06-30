import React, { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  MessageCircle,
  Bug,
  Copy,
  ExternalLink,
  Shield,
  Smartphone,
  Monitor
} from 'lucide-react';
import { LoadingSkeleton, EmptyState } from "@/components/complaints";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo?: React.ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      errorId: this.generateErrorId()
    };
  }

  private generateErrorId(): string {
    return `ERR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true, 
      error,
      errorId: `ERR-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase()
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService(error: Error, errorInfo: React.ErrorInfo) {
    try {
      const errorData = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: null,
      };
      console.log('Error logged:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError);
    }
  }

  private handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: this.generateErrorId()
    });
  };

  private handleCopyErrorId = async () => {
    try {
      await navigator.clipboard.writeText(this.state.errorId);
      console.log('Error ID copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error ID:', err);
    }
  };

  private handleReportError = () => {
    const errorReport = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    const mailtoUrl = `mailto:support@complainthub.com?subject=Error Report - ${this.state.errorId}&body=${encodeURIComponent(
      `Error ID: ${this.state.errorId}\n\nDescription: [Please describe what you were doing when this error occurred]\n\nTechnical Details:\n${JSON.stringify(errorReport, null, 2)}`
    )}`;

    window.location.href = mailtoUrl;
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 flex items-center justify-center p-4 safe-all">
          <Card className="w-full max-w-2xl card-modern animate-fade-in-scale">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl sm:text-2xl text-red-700 dark:text-red-300">
                    เกิดข้อผิดพลาดที่ไม่คาดคิด
                  </CardTitle>
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    ระบบพบปัญหาและไม่สามารถดำเนินการต่อได้
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      รหัสข้อผิดพลาด
                    </p>
                    <p className="font-mono text-lg font-bold text-gray-900 dark:text-white">
                      {this.state.errorId}
                    </p>
                  </div>
                  <Button
                    onClick={this.handleCopyErrorId}
                    variant="outline"
                    size="sm"
                    className="tap-target"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    คัดลอกรหัส
                  </Button>
                </div>
              </div>

              {this.state.error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                    รายละเอียดข้อผิดพลาด
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300 font-mono bg-red-100 dark:bg-red-900/40 p-3 rounded border">
                    {this.state.error.message}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Smartphone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">อุปกรณ์</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    {/Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'มือถือ/แท็บเล็ต' : 'คอมพิวเตร์'}
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">เบราว์เซอร์</span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                     navigator.userAgent.includes('Firefox') ? 'Firefox' :
                     navigator.userAgent.includes('Safari') ? 'Safari' : 'อื่นๆ'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    onClick={this.handleRetry}
                    className="w-full btn-primary tap-target"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    ลองใหม่อีกครั้ง
                  </Button>
                  
                  <Button 
                    onClick={() => window.location.href = '/'}
                    variant="outline"
                    className="w-full tap-target"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    กลับหน้าหลัก
                  </Button>
                </div>

                <Button 
                  onClick={this.handleReportError}
                  variant="outline"
                  className="w-full tap-target"
                >
                  <Bug className="w-4 h-4 mr-2" />
                  รายงานข้อผิดพลาด
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                      ขั้นตอนการแก้ไข
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      <li>1. คลิก "ลองใหม่อีกครั้ง" เพื่อโหลดหน้าใหม่</li>
                      <li>2. ลองปิดและเปิดเบราว์เซอร์ใหม่</li>
                      <li>3. ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต</li>
                      <li>4. หากยังพบปัญหา กรุณารายงานข้อผิดพลาด</li>
                    </ul>
                  </div>
                </div>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border">
                  <summary className="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                    ข้อมูลสำหรับนักพัฒนา
                  </summary>
                  <div className="mt-3 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Stack Trace:</p>
                      <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto">
                        {this.state.error.stack}
                      </pre>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Component Stack:</p>
                        <pre className="text-xs bg-gray-200 dark:bg-gray-700 p-2 rounded overflow-auto">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]} ${className}`} />
  );
}

export function LoadingPage({ 
  message = 'กำลังโหลด...', 
  submessage,
  showLogo = true 
}: { 
  message?: string; 
  submessage?: string;
  showLogo?: boolean;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 safe-all">
      <div className="text-center space-y-6 animate-fade-in-scale">
        {showLogo && (
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="p-3 bg-gradient-primary rounded-xl shadow-large">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Complaint Hub</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">ระบบเรื่องร้องเรียน</p>
            </div>
          </div>
        )}
        
        <LoadingSpinner size="xl" className="mx-auto" />
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {message}
          </h2>
          {submessage && (
            <p className="text-gray-600 dark:text-gray-400">
              {submessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LoadingCard({ 
  title = 'กำลังโหลด...', 
  description,
  className = '' 
}: { 
  title?: string; 
  description?: string;
  className?: string;
}) {
  return (
    <Card className={`card-modern ${className}`}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <LoadingSpinner size="lg" />
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
}

export function LoadingTable({ 
  rows = 5, 
  columns = 4,
  className = '' 
}: { 
  rows?: number; 
  columns?: number;
  className?: string; 
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="animate-pulse">
        <div className="grid gap-4 border-b border-gray-200 dark:border-gray-700 pb-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid gap-4 py-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

