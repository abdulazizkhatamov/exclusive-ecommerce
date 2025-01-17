import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header.tsx";
import { DataTableRowActions } from "@/features/mail/accounts/data-table-row-actions.tsx";
import { MailAccount } from "@/features/mail/accounts/data/schema-mail-accounts.ts";

export const columns: ColumnDef<MailAccount>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("name") as string;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{value}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("key") as string;
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">{value}</span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
