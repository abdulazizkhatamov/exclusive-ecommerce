import { useState } from "react";
import { Inbox, Search } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useChat } from "@/hooks/use-chat.ts";
import { IChat, IChatAccount } from "@/features/chat/types";
import { Nav } from "@/features/chat/chat/nav.tsx";
import { AccountSwitcher } from "@/features/chat/chat/account-switcher.tsx";
import { ChatList } from "@/features/chat/chat/chat-list.tsx";
import { ChatDisplay } from "@/features/chat/chat/chat-display.tsx";

interface ChatProps {
  accounts: IChatAccount[];
  chats: IChat[];
  chatsQuantity: {
    inbox: number;
  };
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Chat({
  accounts,
  chats,
  chatsQuantity,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const useChatHook = useChat();

  // Filter chats based on the search query
  const filteredChats = chats.filter((item) =>
    item.participant.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:chat=${JSON.stringify(
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
                to: "/chats",
                title: "Chats",
                label: chatsQuantity.inbox.toString(),
                icon: Inbox,
                variant: "default",
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
                  All chats
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
              <ChatList items={filteredChats} /> {/* Use filtered chats */}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <ChatDisplay
            chat={
              chats.find((item) => item._id === useChatHook.chat.selected) ||
              null
            }
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
