import React from "react";
import { cn } from "../../../lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer group">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "h-4 w-4 rounded border-border text-primary focus:ring-primary/20 focus:ring-2 transition-colors cursor-pointer",
            className
          )}
          {...props}
        />
        {label && <span className="text-sm text-text group-hover:text-text-secondary transition-colors">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
