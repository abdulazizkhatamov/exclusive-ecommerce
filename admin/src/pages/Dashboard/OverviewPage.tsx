import React from "react";
import { useAnalytics } from "@/hooks/use-analytics.ts";

import RecentSales from "@/components/custom/recent-sales.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import ChartsSection from "@/features/overview/components/ChartsSection.tsx";
import StatCard from "@/features/overview/components/StatCard.tsx";
import RevenueTrendsChart from "@/components/charts/RevenueTrendsChart.tsx";
import { IRecentSale } from "@/features/overview/types.ts";

const OverviewPage: React.FC = () => {
  const { data: dataRevenueTrends } = useAnalytics.useRevenueTrends();
  const { data: dataUsersQuantity } = useAnalytics.useUserQuantity();
  const { data: dataSalesQuantity } = useAnalytics.useSalesQuantity();
  const { data: dataRecentSales } = useAnalytics.useRecentSales();
  const { data: dataTopSellingProducts } = useAnalytics.useTopSellingProducts();
  const { data: dataOrderStatusDistribution } =
    useAnalytics.useOrderStatusDistribution();
  const { data: dataCategoryPerformance } =
    useAnalytics.useCategoryPerformances();

  const latestRevenue =
    dataRevenueTrends?.[dataRevenueTrends.length - 1]?.revenue || 0;
  const previousRevenue =
    dataRevenueTrends?.[dataRevenueTrends.length - 2]?.revenue || 0;
  const percentageChange = previousRevenue
    ? ((latestRevenue - previousRevenue) / previousRevenue) * 100
    : 0;

  return (
    <main className="p-5">
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
            <StatCard
              title="Today's Revenue"
              value={`$${latestRevenue.toLocaleString()}`}
              percentageChange={percentageChange}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              }
            />
            <StatCard
              title="Users"
              value={dataUsersQuantity?.totalUsers || 0}
              percentageChange={dataUsersQuantity?.percentageChange}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              }
            />
            <StatCard
              title="Sales"
              value={`$${dataSalesQuantity?.totalSales.toLocaleString()}`}
              percentageChange={dataSalesQuantity?.percentageChange}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <RevenueTrendsChart chartData={dataRevenueTrends || []} />
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                {dataRecentSales?.map((sale: IRecentSale, index: number) => (
                  <RecentSales key={index} data={sale} />
                ))}
              </CardContent>
            </Card>
          </div>
          <ChartsSection
            dataCategoryPerformance={dataCategoryPerformance || []}
            dataTopSellingProducts={dataTopSellingProducts || []}
            dataOrderStatusDistribution={dataOrderStatusDistribution || []}
          />
        </div>
      </div>
    </main>
  );
};

export default OverviewPage;
