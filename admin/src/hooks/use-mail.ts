import { atom, useAtom } from "jotai";
import { IEmail } from "@/features/mail/types";

type Config = {
  selected: IEmail["_id"] | null; // Use the actual _id from the IEmail interface
};

const configAtom = atom<Config>({
  selected: null,
});

export function useMail() {
  const [mail, setMail] = useAtom(configAtom);

  return {
    mail, // Current selected mail from the atom
    setMail, // Function to set the selected mail
  };
}
