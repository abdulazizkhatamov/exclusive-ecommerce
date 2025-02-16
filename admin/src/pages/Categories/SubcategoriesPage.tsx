import React from "react";
import { DataTable } from "@/components/custom/table/data-table.tsx";
import { DataTableToolbar } from "@/features/subcategories/data-table-toolbar.tsx";
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
import { getSubcategories } from "@/api/api-categories.ts";
import { columns } from "@/features/subcategories/columns.tsx";

const SubcategoriesPage: React.FC = () => {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () => getSubcategories(),
  });

  const table = useReactTable({
    data: subcategories ? subcategories : [],
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
              Here&apos;s a list of your subcategories!
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

export default SubcategoriesPage;
