import React from "react";
import { Outlet } from "react-router-dom";

interface SettingsLayoutProps {}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({}) => {
  return <Outlet />;
};

export default SettingsLayout;
