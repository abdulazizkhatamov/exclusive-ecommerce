import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavAdmin } from "@/components/custom/sidebar/nav-admin.tsx";
import { NavMain } from "@/components/custom/sidebar/nav-main.tsx";
import { SidebarTop } from "@/components/custom/sidebar/sidebar-top.tsx";
import { sidebarMenu } from "@/utils/sidebar-menu.ts";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarTop />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarMenu.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavAdmin admin={sidebarMenu.admin} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
