export interface IChatAccount {
  name: string;
  avatar: string;
  _id: string;
}

interface Participant {
  name: string;
}

interface Message {
  sender: "user" | "admin"; // 'user' or 'admin' to distinguish who sent the message
  message: string;
  sentAt: Date; // Optional because Mongoose will default it to `Date.now`
  isRead: boolean; // Optional because Mongoose defaults it to `false`
}

export interface IChat {
  _id: string;
  participant: Participant;
  messages: Message[];
  support: string | null;
  isAccepted: boolean;
  isDeleted: boolean;
  createdAt: Date; // Optional because Mongoose defaults it to `Date.now`
  updatedAt: Date; // Optional because Mongoose defaults it to `Date.now`
}
