import React, { useEffect } from "react";

import Cookies from "js-cookie";
import { useQuery } from "react-query";

import { getChatAccounts, getChats } from "@/api/api-chat.ts";
import { Chat } from "@/features/chat/chat/chat.tsx";
import socket from "@/utils/socket-io.ts";
import { useToast } from "@/hooks/use-toast.ts";

const ChatsPage: React.FC = () => {
  const { toast } = useToast();

  // Access cookies on the client-side
  const layout = Cookies.get("react-resizable-panels:layout:chat");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");

  const defaultLayout = layout ? JSON.parse(layout) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  const { data: accounts } = useQuery({
    queryKey: ["chat-accounts"],
    queryFn: getChatAccounts,
  });

  const { data: chats, refetch } = useQuery({
    queryKey: ["inbox-chats"],
    queryFn: getChats,
  });

  useEffect(() => {
    // Listen for incoming messages
    socket.on("new_chat_message", (data) => {
      if (data.by.role !== "admin") {
        toast({ title: data.by.name, description: data.message.message });
      }
      refetch();
    });

    // Clean up on component unmount
    return () => {
      socket.off("new_chat_message");
    };
  }, []);

  return (
    <div>
      <div className="flex-col flex">
        {accounts && accounts.length > 0 ? (
          <Chat
            accounts={accounts || []}
            chats={chats || []}
            chatsQuantity={{
              inbox: chats?.length || 0,
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

export default ChatsPage;
