import { cn } from "@/lib/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store.ts";
import { setSelectedMailAccount } from "@/features/mail/mail-slice.ts";
import { IMailAccount } from "@/features/mail/types";

interface AccountSwitcherProps {
  isCollapsed: boolean;
  accounts: IMailAccount[];
}

export function AccountSwitcher({
  isCollapsed,
  accounts,
}: AccountSwitcherProps) {
  const dispatch = useDispatch();
  const selectedAccount = useSelector(
    (state: RootState) => state.mail.selectedAccountId,
  );

  if (!selectedAccount && accounts.length > 0) {
    dispatch(setSelectedMailAccount(accounts[0]._id));
  }

  return (
    <Select
      defaultValue={selectedAccount || accounts[0]._id}
      onValueChange={(value) => dispatch(setSelectedMailAccount(value))}
    >
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden",
        )}
        aria-label="Select account"
      >
        <SelectValue placeholder="Select an account">
          <span className={cn("ml-2", isCollapsed && "mr-2")}>
            {!isCollapsed &&
              accounts.find((account) => account._id === selectedAccount)?.name}
            {isCollapsed &&
              accounts
                .find((account) => account._id === selectedAccount)
                ?.name.substr(0, 1)}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {accounts.map((account) => (
          <SelectItem key={account._id} value={account._id}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {account.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
