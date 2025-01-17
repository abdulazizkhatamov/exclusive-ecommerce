import React from "react";

import CategoryPerformanceBarChart from "@/components/charts/CategoryPerformanceBarChart.tsx";
import TopSellingProductsBarChart from "@/components/charts/TopSellingProductsBarChart.tsx";
import OrderStatusDistributionPieChart from "@/components/charts/OrderStatusDistributionPieChart.tsx";
import {
  ICategoryPerformance,
  IOrderStatusDistribution,
  ITopSellingProducts,
} from "@/features/overview/types.ts";

const ChartsSection: React.FC<{
  dataCategoryPerformance: ICategoryPerformance[];
  dataTopSellingProducts: ITopSellingProducts[];
  dataOrderStatusDistribution: IOrderStatusDistribution[];
}> = ({
  dataCategoryPerformance,
  dataTopSellingProducts,
  dataOrderStatusDistribution,
}) => {
  return (
    <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
      <CategoryPerformanceBarChart chartData={dataCategoryPerformance} />
      <TopSellingProductsBarChart chartData={dataTopSellingProducts} />
      <OrderStatusDistributionPieChart
        chartData={dataOrderStatusDistribution}
      />
    </div>
  );
};

export default ChartsSection;
