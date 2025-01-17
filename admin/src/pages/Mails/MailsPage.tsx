import React from "react";
import Cookies from "js-cookie";
import { Mail } from "@/features/mail/email/mail.tsx";
import { useQuery } from "react-query";
import {
  getInboxMails,
  getMailAccounts,
  getTrashMails,
} from "@/api/api-mail.ts";
import { useLocation } from "react-router-dom";

const MailsPage: React.FC = () => {
  const location = useLocation();

  let mails;

  // Access cookies on the client-side
  const layout = Cookies.get("react-resizable-panels:layout:mail");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  const { data: accounts } = useQuery({
    queryKey: ["mail-accounts"],
    queryFn: getMailAccounts,
  });

  const { data: inboxMails } = useQuery({
    queryKey: ["inbox-mails"],
    queryFn: getInboxMails,
  });

  const { data: trashMails } = useQuery({
    queryKey: ["trash-mails"],
    queryFn: getTrashMails,
  });

  if (location.pathname.includes("mails/trash")) {
    mails = trashMails;
  } else {
    mails = inboxMails;
  }

  return (
    <div>
      <div className="flex-col flex">
        {accounts && accounts.length > 0 ? (
          <Mail
            accounts={accounts || []}
            mails={mails || []}
            mailsQuantity={{
              inbox: inboxMails?.length || 0,
              trash: trashMails?.length || 0,
            }}
            defaultLayout={defaultLayout}
            defaultCollapsed={defaultCollapsed}
            navCollapsedSize={4}
          />
        ) : (
          <div className={"flex justify-center items-center mt-80"}>
            Please add a mail account.
          </div>
        )}
      </div>
    </div>
  );
};

export default MailsPage;
