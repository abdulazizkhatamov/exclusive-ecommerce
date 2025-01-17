export interface IMailAccount {
  name: string;
  key: string;
  _id: string;
}

interface Participant {
  name: string;
  email: string;
  phone: string;
}

interface Message {
  sender: "user" | "admin"; // 'user' or 'admin' to distinguish who sent the message
  message: string;
  sentAt: Date; // Optional because Mongoose will default it to `Date.now`
  isRead: boolean; // Optional because Mongoose defaults it to `false`
}

export interface IEmail {
  _id: string;
  participant: Participant;
  messages: Message[];
  isDeleted: boolean;
  createdAt: Date; // Optional because Mongoose defaults it to `Date.now`
  updatedAt: Date; // Optional because Mongoose defaults it to `Date.now`
}
