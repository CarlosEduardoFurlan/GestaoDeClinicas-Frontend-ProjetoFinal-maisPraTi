import React from "react";
import { cn } from "../../../lib/utils";
import { Loader2, LucideProps } from "lucide-react";

export interface SpinnerProps extends Omit<LucideProps, "size"> {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };
  
  return (
    <Loader2
      className={cn("animate-spin text-primary", sizes[size], className)}
      {...props}
    />
  );
}
