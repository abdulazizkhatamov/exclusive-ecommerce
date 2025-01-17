import { useState } from "react";
import { Inbox, Search, Trash } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { useMail } from "@/hooks/use-mail.ts";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Input } from "@/components/ui/input.tsx";
import { MailDisplay } from "@/features/mail/email/mail-display.tsx";
import { AccountSwitcher } from "@/features/mail/email/account-switcher.tsx";
import { MailList } from "@/features/mail/email/mail-list.tsx";
import { Nav } from "@/features/mail/email/nav.tsx";
import { IEmail, IMailAccount } from "@/features/mail/types";
import { useLocation } from "react-router-dom";

interface MailProps {
  accounts: IMailAccount[];
  mails: IEmail[];
  mailsQuantity: {
    inbox: number;
    trash: number;
  };
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  mailsQuantity,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const useMailHook = useMail();

  const isTrash = location.pathname.includes("mails/trash");

  // Filter mails based on the search query
  const filteredMails = mails.filter((item) =>
    item.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full max-h-screen items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out",
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2",
            )}
          >
            <AccountSwitcher isCollapsed={isCollapsed} accounts={accounts} />
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                to: "/mails",
                title: "Inbox",
                label: mailsQuantity.inbox.toString(),
                icon: Inbox,
                variant: !isTrash ? "default" : "ghost",
              },
              {
                to: "/mails/trash",
                title: "Trash",
                label: mailsQuantity.trash.toString(),
                icon: Trash,
                variant: isTrash ? "default" : "ghost",
              },
            ]}
          />
          <Separator />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="all">
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">Inbox</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="all"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  All mail
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Unread
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                  />
                </div>
              </form>
            </div>
            <TabsContent value="all" className="m-0">
              <MailList items={filteredMails} /> {/* Use filtered mails */}
            </TabsContent>
            <TabsContent value="unread" className="m-0">
              <MailList
                items={filteredMails.filter(
                  (item) => !item.messages?.[item.messages.length - 1].isRead,
                )}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={
              mails.find((item) => item._id === useMailHook.mail.selected) ||
              null
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
