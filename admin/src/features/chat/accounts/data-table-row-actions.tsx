import { Row } from "@tanstack/react-table";

import { useState } from "react";
import { chatAccountSchema } from "@/features/chat/accounts/data/schema-chat-accounts.ts";
import DeleteChatAccountDialog from "@/features/chat/accounts/components/DeleteChatAccountDialog.tsx";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const account = chatAccountSchema.parse(row.original);

  const [deleteChatAccountDialog, setDeleteChatAccountDialog] = useState(false);

  return (
    <>
      <div className={"flex gap-2"}>
        <DeleteChatAccountDialog
          account={account}
          deleteChatAccountDialog={deleteChatAccountDialog}
          setDeleteChatAccountDialog={setDeleteChatAccountDialog}
        />
      </div>
    </>
  );
}
