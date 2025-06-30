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
          "group relative flex items-center justify-start overflow-hidden rounded-full w-12 h-12 transition-all duration-300 shadow-md",
          colorClass,
          className
        )}
        {...props}
      >
        <span className="flex items-center justify-center w-full transition-all duration-300 group-hover:w-[30%] group-hover:pl-4">
          {icon}
        </span>
        <span className="absolute right-0 opacity-0 w-0 text-white text-sm font-semibold transition-all duration-300 group-hover:w-[70%] group-hover:opacity-100 group-hover:pr-3">
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
      label={loading ? "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a..." : "\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e23\u0e30\u0e1a\u0e1a"}
      icon={<LogIn className="w-4 h-4" />}
      colorClass="bg-green-500"
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
      label="\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e23\u0e30\u0e1a\u0e1a"
      icon={<LogOut className="w-4 h-4" />}
      colorClass="bg-red-500"
      className={className}
      {...props}
    />
  )
);
LogoutButton.displayName = "LogoutButton";

export { ExpandButton };
