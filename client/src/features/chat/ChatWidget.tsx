import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, MessageCircleMore, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery } from "react-query";
import { getChat, postCreateChat, postSendMessage } from "@/api/requests.ts"; // Add postSendMessage
import { RootState } from "@/app/store.ts";
import {
  setChat,
  setInput,
  setSession,
  setSessionName,
  toggleChat,
} from "@/features/chat/chat-slice.ts";
import socket from "@/utils/socket-io.ts"; // Adjust the import accordingly

const ChatWidget: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, input, session, sessionName, chat } = useSelector(
    (state: RootState) => state.chat,
  );

  const createChatMutation = useMutation({ mutationFn: postCreateChat });
  const sendMessageMutation = useMutation({ mutationFn: postSendMessage }); // Add mutation for sending messages

  const lastMessageRef = useRef<HTMLDivElement | null>(null); // Create a ref for the last message

  const handleStartChat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session) {
      createChatMutation.mutate(
        { name: sessionName },
        {
          onSuccess: (response) => {
            const newSession = {
              chatId: response.chat._id,
              name: response.chat.participant.name,
            };
            dispatch(setSession(JSON.stringify(newSession)));
          },
        },
      );
    }
  };

  const sendMessage = () => {
    if (input.trim() === "") return;

    if (session) {
      sendMessageMutation.mutate(
        {
          _id: JSON.parse(session).chatId,
          sender: "user",
          message: input,
          sentAt: new Date().toISOString(),
          isRead: false,
        },
        {
          onSuccess: (response) => {
            dispatch(setChat(response.chat)); // Update chat with the new message
            dispatch(setInput("")); // Clear input field
          },
        },
      );
    }
  };

  const {
    data: chatData,
    error,
    refetch,
  } = useQuery(
    ["chat", session],
    () => (session ? getChat(JSON.parse(session).chatId) : null),
    {
      enabled: !!session,
    },
  );

  useEffect(() => {
    if (chatData) {
      dispatch(setChat(chatData));
    }
  }, [chatData]);

  // Scroll to the bottom when a new message is added or the chat window is opened
  useEffect(() => {
    if (isOpen && lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView();
    }
  }, [chat?.messages, isOpen]); // Trigger when messages update or chat window is opened

  useEffect(() => {
    // Listen for incoming messages
    socket.on("new_chat_message", (data) => {
      const { chatId } = data;

      if (session) {
        if (chatId === JSON.parse(session).chatId) {
          refetch();
        }
      }
    });

    // Clean up on component unmount
    return () => {
      socket.off("new_chat_message");
    };
  }, []);

  if (error) {
    localStorage.removeItem("chat_session");
    dispatch(setChat(null));
    dispatch(setSession(null));
  }

  return (
    <div className="z-50 fixed bottom-4 right-4">
      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          onClick={() => dispatch(toggleChat())}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-primary_red rounded-full p-4 shadow-md text-white"
        >
          <MessageCircleMore />
        </motion.button>
      )}

      {isOpen && !session && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <form onSubmit={handleStartChat}>
            {/* Chat Header */}
            <div className="p-4 bg-primary_red text-white rounded-t-lg flex justify-between items-center">
              <h3>Chat</h3>
              <button
                onClick={() => dispatch(toggleChat())}
                className="text-white font-bold focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Name Input */}
            <div className="p-4">
              <h3 className="text-center mb-4">Please enter your name</h3>
              <input
                type="text"
                value={sessionName}
                onChange={(e) => dispatch(setSessionName(e.target.value))}
                className="border rounded-lg w-full p-2 mb-4"
                placeholder="Your Name"
              />
              <button
                type={"submit"}
                className="bg-primary_red text-white px-4 py-2 rounded-lg w-full"
              >
                Start Chat
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Chat Window */}
      {isOpen && session && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-4 bg-primary_red text-white rounded-t-lg flex justify-between items-center">
            <h3>Chat</h3>
            <button
              onClick={() => dispatch(toggleChat())}
              className="text-white font-bold focus:outline-none"
            >
              <X />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 h-80 overflow-y-auto ">
            {chat?.messages?.map((message, index: number) => (
              <div
                key={index}
                className={`mb-3 ${message.sender === "user" ? "text-right" : "text-left"}`}
              >
                <div
                  className={`message ${
                    message.sender === "user"
                      ? "bg-primary_red text-white ml-auto"
                      : "bg-gray-200"
                  } max-w-max p-1 px-2 rounded-lg relative`}
                >
                  <p className="break-words whitespace-pre-wrap text-[13px]">
                    {message.message}
                  </p>
                </div>
                <small className="text-xs text-gray-500">
                  {new Date(message.sentAt).toLocaleTimeString()}
                </small>
              </div>
            ))}
            <div ref={lastMessageRef} /> {/* Add the ref here */}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => dispatch(setInput(e.target.value))}
              className="flex-grow border rounded-lg px-3 py-2 focus:outline-none"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-primary_red text-white px-4 py-2 rounded-lg"
              disabled={sendMessageMutation.isLoading}
            >
              {sendMessageMutation.isLoading ? (
                <Loader className={"w-4 h-4 animate-spin"} />
              ) : (
                "Send"
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatWidget;
