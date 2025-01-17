import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

interface StatCardProps {
  title: string;
  value: string | number;
  percentageChange?: number;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentageChange,
  icon,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {percentageChange !== undefined && (
          <p className="text-xs text-muted-foreground">
            {percentageChange > 0
              ? `+${percentageChange.toFixed(1)}%`
              : `${percentageChange.toFixed(1)}%`}{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
