import { create } from "zustand";
import { api } from "../lib/api";

export interface Chat extends PdfInfo {
  id: string;
}

export interface PdfInfo {
  fileName: string;
  fileUrl: string;
}

interface ChatStore {
  chatHistory: Chat[];
  selectedChat: Chat | null;
  chats: Chat[];
  pdfInfo: PdfInfo;

  setChatHistory: (chatHistory: Chat[]) => void;
  setSelectedChat: (selectedChat: Chat | null) => void;
  setChats: (chats: Chat[]) => void;
  setPdfInfo: (pdfInfo: PdfInfo) => void;

  addChatToHistory: (chat: Chat) => void;
  removeChatFromHistory: (chatId: string) => void;

  // Services
  uploadPdf: (file: File, onSuccess: (id: string) => void) => Promise<void>;
  getChatDocuments: () => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatHistory: [],
  selectedChat: null,
  chats: [],
  pdfInfo: {
    fileName: "",
    fileUrl: "",
  },

  setChatHistory: (chatHistory) => set({ chatHistory }),
  setSelectedChat: (selectedChat) => set({ selectedChat }),
  setChats: (chats) => set({ chats }),
  setPdfInfo: (pdfInfo) => set({ pdfInfo }),

  addChatToHistory: (chat) => {
    const { chatHistory } = get();
    set({ chatHistory: [chat, ...chatHistory] });
  },

  removeChatFromHistory: (chatId) => {
    const { chatHistory } = get();
    set({ chatHistory: chatHistory.filter((chat) => chat.id !== chatId) });
  },

  uploadPdf: async (file: File, onSuccess: (id: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await api.post("/api/chat/upload", formData);
      set({
        pdfInfo: {
          fileName: response.data.document.filename,
          fileUrl: response.data.fileUrl,
        },
        chatHistory: [
          {
            id: response.data.document.id,
            fileName: response.data.document.filename,
            fileUrl: response.data.document.fileUrl,
          },
          ...get().chatHistory,
        ],
        selectedChat: {
          id: response.data.document.id,
          fileName: response.data.document.filename,
          fileUrl: response.data.fileUrl,
        },
      });
      onSuccess(response.data.document.id);
    } catch (error) {
      console.error(error);
    }
  },

  getChatDocuments: async () => {
    try {
      const response = await api.get("/api/chat/documents");
      set({
        chatHistory: response.data.documents.map(
          (document: {
            id: string;
            filename: string;
            fileUrl: string;
          }): Chat => ({
            id: document.id,
            fileName: document.filename,
            fileUrl: document.fileUrl,
          })
        ),
      });
    } catch (error) {
      console.error(error);
    }
  },
}));
