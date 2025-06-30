import * as React from "react";
import { LogIn, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ReactNode;
  colorClass?: string;
}

const ExpandButton = React.forwardRef<HTMLButtonElement, ExpandButtonProps>(
  ({ label, icon, colorClass = "bg-red-500", className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative flex items-center justify-start overflow-hidden rounded-full w-12 h-12 transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl transform hover:scale-105 hover:w-40",
          colorClass,
          "hover:bg-opacity-90",
          className
        )}
        {...props}
      >
        <span className="flex items-center justify-center w-12 h-12 transition-all duration-500 ease-in-out group-hover:w-12 group-hover:flex-shrink-0 text-white">
          {icon}
        </span>
        <span className="absolute left-12 opacity-0 w-0 text-white text-sm font-semibold whitespace-nowrap transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:w-28 overflow-hidden">
          {label}
        </span>
      </button>
    );
  }
);
ExpandButton.displayName = "ExpandButton";

interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const LoginButton = React.forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ loading, className, ...props }, ref) => (
    <ExpandButton
      ref={ref}
      label={loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      icon={<LogIn className="w-5 h-5" />}
      colorClass="bg-green-500 hover:bg-green-600"
      className={className}
      {...props}
    />
  )
);
LoginButton.displayName = "LoginButton";

export const LogoutButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <ExpandButton
      ref={ref}
      label="ออกจากระบบ"
      icon={<LogOut className="w-5 h-5" />}
      colorClass="bg-red-500 hover:bg-red-600"
      className={className}
      {...props}
    />
  )
);
LogoutButton.displayName = "LogoutButton";

export { ExpandButton };
