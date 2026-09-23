import React from "react";
import { cn } from "../../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50",
            error ? "border-danger focus:ring-danger/20" : "border-border",
            className
          )}
          {...props}
        />
        {error && <span className="text-xs font-medium text-danger">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
