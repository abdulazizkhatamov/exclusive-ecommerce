import React from "react";
import { DataTableToolbar } from "@/features/subcategories/data-table-toolbar.tsx";
import { DataTablePagination } from "@/components/custom/table/data-table-pagination.tsx";
import { Table } from "@tanstack/react-table";
import { DataTable } from "@/components/custom/table/data-table.tsx";
import { Subcategory } from "@/features/subcategories/data/schema-subcategories.ts";

interface SubcategoriesTabProps {
  table: Table<Subcategory>;
}

const SubcategoriesTab: React.FC<SubcategoriesTabProps> = ({ table }) => (
  <DataTable
    dataTableToolbar={<DataTableToolbar table={table} />}
    dataTablePagination={<DataTablePagination table={table} />}
    table={table}
  />
);

export default SubcategoriesTab;
