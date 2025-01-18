import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/custom/table/data-table-column-header.tsx";
import { ChatAccount } from "@/features/chat/accounts/data/schema-chat-accounts.ts";
import { DataTableRowActions } from "@/features/chat/accounts/data-table-row-actions.tsx";

export const columns: ColumnDef<ChatAccount>[] = [
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
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
