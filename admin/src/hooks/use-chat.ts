import { atom, useAtom } from "jotai";
import { IChat } from "@/features/chat/types";

type Config = {
  selected: IChat["_id"] | null; // Use the actual _id from the IEmail interface
};

const configAtom = atom<Config>({
  selected: null,
});

export function useChat() {
  const [chat, setChat] = useAtom(configAtom);

  return {
    chat, // Current selected mail from the atom
    setChat, // Function to set the selected mail
  };
}
