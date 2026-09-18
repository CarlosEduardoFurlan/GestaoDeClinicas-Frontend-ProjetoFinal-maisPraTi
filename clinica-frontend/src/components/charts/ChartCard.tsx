import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../data-display/Card/Card";
import { cn } from "../../lib/utils";

export interface ChartCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, className, ...props }: ChartCardProps) {
  return (
    <Card className={cn("flex flex-col", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 min-h-[300px]">
        {children}
      </CardContent>
    </Card>
  );
}
