import React from "react";
import { DataTable } from "@/components/custom/table/data-table.tsx";
import { DataTableToolbar as DataTableToolbarProducts } from "@/features/products/data-table-toolbar.tsx";
import { DataTablePagination } from "@/components/custom/table/data-table-pagination.tsx";
import { Table } from "@tanstack/react-table";
import { Product } from "@/features/products/data/schema-products.ts";

interface ProductsTabProps {
  table: Table<Product>;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ table }) => (
  <DataTable
    dataTableToolbar={<DataTableToolbarProducts table={table} />}
    dataTablePagination={<DataTablePagination table={table} />}
    table={table}
  />
);

export default ProductsTab;
