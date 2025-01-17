import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CalendarDateRangePicker } from "@/components/custom/category/date-range-picker.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { columns as columnsProducts } from "@/features/products/columns.tsx";
import { useQuery } from "react-query";
import { getProductsByCategory } from "@/api/api-products.ts";
import ProductsTab from "@/components/custom/ProductsTab.tsx";

const SubcategoryPage: React.FC = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  if (!_id) navigate("/categories/subcategories");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data: products } = useQuery({
    queryKey: ["category-products"],
    queryFn: () => getProductsByCategory(_id as string),
  });

  const tableProducts = useReactTable({
    data: products || [],
    columns: columnsProducts,
    state: { sorting, columnVisibility, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <>
      <div className="flex-col flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="space-y-4">
              <ProductsTab table={tableProducts} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SubcategoryPage;
