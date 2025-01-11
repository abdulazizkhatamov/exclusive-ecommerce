import React from "react";
import Cookies from "js-cookie";
import { Mail } from "@/components/custom/mail/mail.tsx";
import { accounts, mails } from "@/components/custom/mail/data.tsx";

interface AllMailsPageProps {}

const AllMailsPage: React.FC<AllMailsPageProps> = ({}) => {
  // Access cookies on the client-side
  const layout = Cookies.get("react-resizable-panels:layout:mail");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  return (
    <div>
      <div className="flex-col flex">
        <Mail
          accounts={accounts}
          mails={mails}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </div>
  );
};

export default AllMailsPage;
