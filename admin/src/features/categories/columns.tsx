import { ColumnDef } from "@tanstack/react-table";

import { Category } from "@/features/categories/data/schema-categories.ts";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header.tsx";
import { statuses } from "@/features/categories/data/data-categories.tsx";
import { DataTableRowActions } from "@/features/categories/data-table-row-actions.tsx";
import { Link } from "react-router-dom";

export const columns: ColumnDef<Category>[] = [
  {
    accessorKey: "_id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => (
      <div className="max-w-max w-full">
        {(() => {
          const value = row.getValue("_id") as string; // Get the value
          const firstFour = value.slice(0, 7); // First 4 characters
          const lastFour = value.slice(-4); // Last 4 characters
          return `${firstFour}.....${lastFour}`; // Concatenate with dots
        })()}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} visibility={false} title="Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Link
            className={"hover:underline"}
            to={`/categories/category/${row.getValue("_id")}`}
          >
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </Link>
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {(() => {
              const value = row.getValue("description") as string; // Get the value
              const description = value.slice(0, 17);
              return value.length < 17 ? value : `${description}...`; // Concatenate with dots
            })()}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "subcategories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategories" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-medium">
            {row.getValue("subcategories")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Products" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[100px] truncate font-medium">
            {row.getValue("products")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status"),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
