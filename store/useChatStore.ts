import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

type Message = {
  id: string;
  role: string;
  content: string;
};

type ChatState = {
  messages: Message[];
  addMessage: (text: string, sender: string) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (text, sender) => {
    const who = sender === "bot" ? "GPT" : "user";
    const message = {
      id: uuidv4(),
      role: who,
      content: text
    }
    set((state) => ({
      messages: [...state.messages, message]
    }));
  },
  clearMessages: () => {
    set({ messages: [] });
  },
}));
