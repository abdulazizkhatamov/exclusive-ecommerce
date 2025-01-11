import React from "react";
import { columns } from "@/features/categories/columns.tsx";
import { DataTable } from "@/components/custom/table/data-table.tsx";
import { DataTableToolbar } from "@/features/categories/data-table-toolbar.tsx";
import { DataTablePagination } from "@/components/custom/table/data-table-pagination.tsx";
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
import { useQuery } from "react-query";
import { getCategories } from "@/api/api-categories.ts";

const CategoriesPage: React.FC = () => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const table = useReactTable({
    data: categories ? categories : [],
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
      <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your categories!
            </p>
          </div>
        </div>
        {/* Pass the table instance and toolbar, pagination components as props */}
        <DataTable
          dataTableToolbar={<DataTableToolbar table={table} />}
          dataTablePagination={<DataTablePagination table={table} />}
          table={table}
        />
      </div>
    </>
  );
};

export default CategoriesPage;
