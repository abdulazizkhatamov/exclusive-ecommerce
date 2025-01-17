import { Row } from "@tanstack/react-table";

import { useState } from "react";
import { mailAccountSchema } from "@/features/mail/accounts/data/schema-mail-accounts.ts";
import DeleteMailAccountDialog from "@/features/mail/accounts/components/DeleteMailAccountDialog.tsx";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const account = mailAccountSchema.parse(row.original);

  const [deleteMailAccountDialog, setDeleteMailAccountDialog] = useState(false);

  return (
    <>
      <div className={"flex gap-2"}>
        <DeleteMailAccountDialog
          account={account}
          deleteMailAccountDialog={deleteMailAccountDialog}
          setDeleteMailAccountDialog={setDeleteMailAccountDialog}
        />
      </div>
    </>
  );
}
