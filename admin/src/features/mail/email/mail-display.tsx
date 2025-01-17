import { format } from "date-fns";

import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

import { IEmail } from "@/features/mail/types";
import { useMutation } from "react-query";
import { postSendMessage, putUpdateMessageStatus } from "@/api/api-mail.ts";
import { useEffect } from "react";
import { queryClient } from "@/api/api.ts";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store.ts";
import { Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast.ts";

interface MailDisplayProps {
  mail: IEmail | null;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const { selectedAccountId } = useSelector((state: RootState) => state.mail);
  const location = useLocation();
  const { toast } = useToast();

  const updateMsgStatusMutation = useMutation({
    mutationFn: putUpdateMessageStatus,
  });

  const sendMessageMutation = useMutation({
    mutationFn: postSendMessage,
  });

  const sendMessageFormik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: async (values, { resetForm }) => {
      if (mail) {
        sendMessageMutation.mutate(
          { _id: mail._id, message: values.message, apiKey: selectedAccountId },
          {
            onSuccess: async () => {
              if (location.pathname.includes("mails/trash")) {
                await queryClient.invalidateQueries(["trash-mails"]);
              } else {
                await queryClient.invalidateQueries(["inbox-mails"]);
              }
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

  const isLatestMessageRead =
    mail && mail.messages?.[mail.messages.length - 1].isRead;

  useEffect(() => {
    if (mail && isLatestMessageRead === false) {
      updateMsgStatusMutation.mutate(
        { _id: mail._id, status: true },
        {
          onSuccess: async () => {
            if (location.pathname.includes("mails/trash")) {
              await queryClient.invalidateQueries(["trash-mails"]);
            } else {
              await queryClient.invalidateQueries(["inbox-mails"]);
            }
          },
        },
      );
    }
  }, [mail]);

  return (
    <div className="flex h-full flex-col">
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.participant.name} />
                <AvatarFallback>
                  {mail.participant.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.participant.name}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span>{" "}
                  {mail.participant.email}
                </div>
              </div>
            </div>
            {mail.createdAt && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.createdAt), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          {/* Display all messages */}
          <div className="flex-1 overflow-y-auto p-4 text-sm space-y-4">
            {mail.messages.map((msg, index: number) => (
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
                  placeholder={`Reply to ${mail.participant.name}...`}
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
