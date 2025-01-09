import React from "react";
import { Outlet } from "react-router-dom";

const MailsLayout: React.FC<MailsLayoutProps> = () => {
  return <Outlet />;
};

export default MailsLayout;
