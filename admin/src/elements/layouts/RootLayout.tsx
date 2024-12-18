import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { AppSidebar } from "@/components/custom/sidebar/app-sidebar.tsx";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { sidebarMenu } from "@/utils/sidebar-menu.ts";

const RootLayout: React.FC = () => {
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const pathname = location.pathname;

  /**
   * Utility function to find breadcrumb details
   * @param path - Path to search for
   * @returns An array with parent and child titles or null
   */
  const findBreadcrumbDetails = (
    path: string,
  ): { parent: string; child: string } | null => {
    for (const menu of sidebarMenu.navMain) {
      for (const item of menu.items) {
        if (item.url === path) {
          return { parent: menu.title, child: item.title };
        }
      }
    }
    return null; // No match found
  };

  // Generate breadcrumb items dynamically
  const breadcrumbDetails = findBreadcrumbDetails(pathname.replace("/", "")); // Remove leading slash
  const breadcrumbItems = breadcrumbDetails
    ? [
        { title: breadcrumbDetails.parent, path: "#", isLast: false }, // Parent menu
        { title: breadcrumbDetails.child, path: pathname, isLast: true }, // Child menu
      ]
    : [{ title: "Home", path: "/", isLast: true }]; // Fallback to Home if no match

  return accessToken ? (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {pathname !== "/mails" && (
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbItems.map((item, idx) => (
                      <React.Fragment key={idx}>
                        {/* Render BreadcrumbItem for each item */}
                        <BreadcrumbItem>
                          {item.isLast ? (
                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={item.path}>
                              {item.title}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>

                        {/* Render separator between items, but not after the last item */}
                        {idx < breadcrumbItems.length - 1 && (
                          <BreadcrumbSeparator />
                        )}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
          )}
          <div className="flex flex-1 flex-col">
            <div className="min-h-[100vh] flex-1 bg-muted/50 md:min-h-min">
              <Outlet />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  ) : (
    <Navigate to={"/auth"} replace={true} />
  );
};

export default RootLayout;
