import { formatDistanceToNow } from "date-fns";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { cn } from "@/lib/utils.ts";
import { useMail } from "@/hooks/use-mail.ts";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { IEmail } from "@/features/mail/types";
import { MailOpen, RotateCcw, Trash2 } from "lucide-react";
import { queryClient } from "@/api/api.ts";
import { useMutation } from "react-query";
import { deleteDeleteMessage, putUpdateMessageStatus } from "@/api/api-mail.ts";

interface MailListProps {
  items: IEmail[];
}

export function MailList({ items }: MailListProps) {
  const useMailHook = useMail();

  const updateMsgStatusMutation = useMutation({
    mutationFn: putUpdateMessageStatus,
  });

  const deleteMsgMutation = useMutation({ mutationFn: deleteDeleteMessage });

  const deleteMsgHandler = (_id: string, type: string) => {
    deleteMsgMutation.mutate(
      { _id, type },
      {
        onSuccess: async () => {
          // Update the cache directly
          if (type === "TRASH") {
            queryClient.setQueryData<IEmail[]>(["inbox-mails"], (old = []) =>
              old.filter((item) => item._id !== _id),
            );
            queryClient.setQueryData<IEmail[]>(["trash-mails"], (old = []) => {
              const movedMessage = items.find((item) => item._id === _id);
              return movedMessage ? [...old, movedMessage] : old;
            });
          } else if (type === "DELETE") {
            queryClient.setQueryData<IEmail[]>(["trash-mails"], (old = []) =>
              old.filter((item) => item._id !== _id),
            );
          }

          // Optionally trigger re-fetch to ensure data consistency
          await queryClient.invalidateQueries(["trash-mails"]);
          await queryClient.invalidateQueries(["inbox-mails"]);
        },
      },
    );
  };

  const handleMarkUnread = (mail: IEmail) => {
    if (mail) {
      updateMsgStatusMutation.mutate(
        { _id: mail._id, status: false },
        {
          onSuccess: async () => {
            queryClient.setQueryData<IEmail[]>(
              ["trash-mails"],
              (old) =>
                old?.map((item) =>
                  item._id === mail._id ? { ...item, isRead: false } : item,
                ) || [],
            );
            queryClient.setQueryData<IEmail[]>(
              ["inbox-mails"],
              (old) =>
                old?.map((item) =>
                  item._id === mail._id ? { ...item, isRead: false } : item,
                ) || [],
            );
            await queryClient.invalidateQueries(["trash-mails"]);
            await queryClient.invalidateQueries(["inbox-mails"]);
          },
        },
      );
    }
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
                  useMailHook.mail.selected === item._id && "bg-muted",
                )}
                onClick={() =>
                  useMailHook.setMail({
                    ...useMailHook.mail,
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
                      {!item.messages?.[item.messages.length - 1].isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        useMailHook.mail.selected === item._id
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
                  {item.messages?.[item.messages.length - 1].message.substring(
                    0,
                    300,
                  )}
                </div>
              </button>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={() => {
                  handleMarkUnread(item);
                }}
              >
                <MailOpen className={"w-4 h-4 mr-2"} />
                Mark as unread
              </ContextMenuItem>
              {item.isDeleted && (
                <ContextMenuItem
                  onClick={() => deleteMsgHandler(item._id, "RECOVER")}
                >
                  <RotateCcw className={"w-4 h-4 mr-2"} />
                  Recover
                </ContextMenuItem>
              )}
              <ContextMenuItem
                onClick={() =>
                  deleteMsgHandler(
                    item._id,
                    item.isDeleted ? "DELETE" : "TRASH",
                  )
                }
              >
                <Trash2 className={"w-4 h-4 mr-2"} />
                {item.isDeleted ? "Delete" : "Move to trash"}
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    </ScrollArea>
  );
}
