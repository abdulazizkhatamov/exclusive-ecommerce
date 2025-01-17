import React from "react";
import { PieChart, Pie, Label, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card.tsx";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";

// Define data types
type DataType = {
  _id: string;
  count: number;
};

interface OrderStatusDistributionPieChartProps {
  chartData: DataType[];
}

const OrderStatusDistributionPieChart: React.FC<
  OrderStatusDistributionPieChartProps
> = ({ chartData }) => {
  // Calculate the total count
  const totalCount = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData],
  );

  // Dynamically create chartConfig
  const chartConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {};
    chartData.forEach((entry, index) => {
      config[entry._id] = {
        label: entry._id, // Label dynamically set to _id
        color: `hsl(${(index * 60) % 360}, 70%, 60%)`, // Generate color based on index (using HSL for variety)
      };
    });
    return config;
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>Overview of order statuses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="_id"
              innerRadius={60}
              strokeWidth={5}
              paddingAngle={5}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry._id]?.color || "#ccc"}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default OrderStatusDistributionPieChart;
