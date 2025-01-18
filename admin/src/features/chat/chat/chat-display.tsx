import { useRef, useEffect } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

import { useMutation } from "react-query";
import { postSendMessage } from "@/api/api-chat.ts";

import { queryClient } from "@/api/api.ts";
import { useFormik } from "formik";

import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast.ts";
import { IChat } from "@/features/chat/types";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";

interface ChatDisplayProps {
  chat: IChat | null;
}

export function ChatDisplay({ chat }: ChatDisplayProps) {
  const { toast } = useToast();
  const { selectedAccountId } = useSelector((state: RootState) => state.chat);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = useMutation({
    mutationFn: postSendMessage,
  });

  const sendMessageFormik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async (values, { resetForm }) => {
      if (chat) {
        sendMessageMutation.mutate(
          {
            _id: chat._id,
            message: values.message,
            support: selectedAccountId,
          },
          {
            onSuccess: async () => {
              await queryClient.invalidateQueries(["inbox-chats"]);
              resetForm();
            },
            onError: (response: unknown) => {
              const errorResponse = response as { message: string }; // Assert the type

              toast({
                variant: "destructive",
                title: "Something went wrong",
                description: errorResponse.message,
              });
              resetForm();
            },
          },
        );
      }
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat?.messages]);

  return (
    <div className="flex h-full flex-col">
      {chat ? (
        <div className="flex flex-col h-full">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={chat.participant.name} />
                <AvatarFallback>
                  {chat.participant.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{chat.participant.name}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {chat.participant.name}
                </div>
              </div>
            </div>
            {chat.createdAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(chat.createdAt), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          {/* Display all messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 text-sm space-y-4"
          >
            {chat.messages.map((msg, index: number) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-gray-100 text-black"
                      : "bg-black text-white"
                  }`}
                >
                  <p>{msg.message}</p>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(msg.sentAt), "PPpp")}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form onSubmit={sendMessageFormik.handleSubmit}>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  id="message"
                  onChange={sendMessageFormik.handleChange}
                  onBlur={sendMessageFormik.handleBlur}
                  value={sendMessageFormik.values.message}
                  placeholder={`Reply to ${chat.participant.name}...`}
                />
                <div className="flex items-center">
                  <Button
                    size="sm"
                    className="ml-auto px-8"
                    type="submit"
                    disabled={sendMessageMutation.isLoading}
                  >
                    {sendMessageMutation.isLoading ? (
                      <Loader className="animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
