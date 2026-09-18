import React from "react";
import { cn } from "../../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "info" | "neutral";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold";
    
    const variants = {
      primary: "bg-primary/10 text-primary",
      success: "bg-success/10 text-success",
      warning: "bg-warning/10 text-warning",
      danger: "bg-danger/10 text-danger",
      info: "bg-info/10 text-info",
      neutral: "bg-surface-secondary text-text-secondary border border-border",
    };

    return (
      <div
        ref={ref}
        className={cn(baseStyles, variants[variant], className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
