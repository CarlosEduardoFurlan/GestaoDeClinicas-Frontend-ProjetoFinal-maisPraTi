import React from "react";
import { cn } from "../../../lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 relative">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full appearance-none rounded-[var(--radius-md)] border bg-surface px-3 py-2 text-sm text-text transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger focus:ring-danger/20" : "border-border",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-text-muted pointer-events-none" />
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
      </div>
    );
  }
);
Select.displayName = "Select";
