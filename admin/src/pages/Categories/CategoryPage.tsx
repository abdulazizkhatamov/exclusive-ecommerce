import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { CalendarDateRangePicker } from "@/components/custom/category/date-range-picker.tsx";
import { getSubcategoriesByParent } from "@/api/api-categories.ts";
import { getProductsByCategory } from "@/api/api-products.ts";
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
import { columns as columnsSubcategories } from "@/features/subcategories/columns.tsx";
import { columns as columnsProducts } from "@/features/products/columns.tsx";
import SubcategoriesTab from "@/components/custom/SubcategoriesTab.tsx";
import ProductsTab from "@/components/custom/ProductsTab.tsx";

const CategoryPage: React.FC = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  if (!_id) navigate("/categories");

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getSubcategoriesByParent(_id as string),
  });

  const { data: products } = useQuery({
    queryKey: ["category-products"],
    queryFn: () => getProductsByCategory(_id as string),
  });

  const subcategoriesTable = useReactTable({
    data: subcategories || [],
    columns: columnsSubcategories,
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
    <div className="flex-col flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Category</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="subcategories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="subcategories">
            <SubcategoriesTab table={subcategoriesTable} />
          </TabsContent>
          <TabsContent value="products">
            <ProductsTab table={tableProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryPage;
