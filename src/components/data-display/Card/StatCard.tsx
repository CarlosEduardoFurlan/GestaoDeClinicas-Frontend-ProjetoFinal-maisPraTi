import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";
import { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ title, value, trend, trendDirection = "neutral", icon: Icon, className }: StatCardProps) {
  const trendColor = {
    up: "text-success",
    down: "text-danger",
    neutral: "text-text-muted",
  };

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-secondary">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-text-muted" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text">{value}</div>
        {trend && (
          <p className={cn("text-xs mt-1 font-medium", trendColor[trendDirection])}>
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
