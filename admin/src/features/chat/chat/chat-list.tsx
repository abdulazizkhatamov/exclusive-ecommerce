import { formatDistanceToNow } from "date-fns";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { cn } from "@/lib/utils.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { Trash2 } from "lucide-react";
import { useMutation } from "react-query";
import { IChat } from "@/features/chat/types";
import { useChat } from "@/hooks/use-chat.ts";
import { deleteDeleteMessage } from "@/api/api-chat.ts";
import { queryClient } from "@/api/api.ts";

interface ChatListProps {
  items: IChat[];
}

export function ChatList({ items }: ChatListProps) {
  const useChatHook = useChat();

  const deleteMsgMutation = useMutation({ mutationFn: deleteDeleteMessage });

  const deleteMsgHandler = (_id: string) => {
    deleteMsgMutation.mutate(
      { _id },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["inbox-chats"]);
        },
      },
    );
  };

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item, index: number) => (
          <ContextMenu key={index}>
            <ContextMenuTrigger className={"w-full"}>
              <button
                key={item._id}
                className={cn(
                  "w-full flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                  useChatHook.chat.selected === item._id && "bg-muted",
                )}
                onClick={() =>
                  useChatHook.setChat({
                    ...useChatHook.chat,
                    selected: item._id,
                  })
                }
              >
                <div className="flex w-full flex-col gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        {item.participant.name}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        useChatHook.chat.selected === item._id
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {formatDistanceToNow(new Date(item.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                </div>
                <div className="line-clamp-2 text-xs text-muted-foreground">
                  {item.messages?.[item.messages.length - 1].message?.substring(
                    0,
                    300,
                  )}
                </div>
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => deleteMsgHandler(item._id)}>
                <Trash2 className={"w-4 h-4 mr-2"} />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </ScrollArea>
  );
}
