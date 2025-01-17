import React from "react";
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingUp } from "lucide-react";

type DataType = {
  _id: string;
  name: string;
  productCount: number;
};

interface CategoryDistributionProps {
  chartData: DataType[];
}

const chartConfig = {
  productCount: {
    label: "Product Quantity",
    color: "hsl(var(--chart-4))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

const CategoryDistributionBarChart: React.FC<CategoryDistributionProps> = ({
  chartData,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution Overview</CardTitle>
        <CardDescription>Number of products in each category</CardDescription>
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
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="productCount" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="productCount"
              layout="vertical"
              fill="var(--color-productCount)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="productCount"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `${value} products`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Category with the most products: {chartData[0]?.name}{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Displaying the total number of products in each category
        </div>
      </CardFooter>
    </Card>
  );
};

export default CategoryDistributionBarChart;
