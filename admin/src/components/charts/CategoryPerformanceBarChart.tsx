"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";

type DataType = {
  _id: string;
  totalRevenue: number;
  totalQuantity: number;
};

interface CategoryPerformanceBarChartProps {
  chartData: DataType[];
}

const chartConfig = {
  totalRevenue: {
    label: "Revenue",
    color: "hsl(var(--chart-2))",
  },
  totalQuantity: {
    label: "Quantity Sold",
    color: "hsl(var(--chart-3))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const CategoryPerformanceBarChart: React.FC<
  CategoryPerformanceBarChartProps
> = ({ chartData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance Overview</CardTitle>
        <CardDescription>
          Revenue and quantity of products sold per category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="_id"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="totalRevenue" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="totalRevenue"
              layout="vertical"
              fill="var(--color-totalRevenue)"
              radius={4}
            >
              <LabelList
                dataKey="_id"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="totalRevenue"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `$${value.toFixed(2)}`}
              />
            </Bar>
            <Bar
              dataKey="totalQuantity"
              layout="vertical"
              fill="var(--color-totalQuantity)"
              radius={4}
            >
              <LabelList
                dataKey="_id"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="totalQuantity"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `${value} units`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Best performing category: {chartData[0]?._id}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Displaying total revenue and quantity sold for each category
        </div>
      </CardFooter>
    </Card>
  );
};

export default CategoryPerformanceBarChart;
