import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Input,
  Text,
  Avatar,
  Spinner,
} from "@fluentui/react-components";
import { Send24Regular } from "@fluentui/react-icons";
import { useChatPanelStyles } from "./chat_panel_styled";
import { useUser } from "@stackframe/react";
import { useParams } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  initialMessages?: Message[];
  suggestedQuestions?: string[];
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  initialMessages = [],
  suggestedQuestions = [
    "Summarize o tracker thaj hoj dikhav kako o tracker kerel kaj?",
    "So sikav te inportantno te trackinav habits regularly?",
    "Kako mešav te optimizirav o tracker te del me te ken?",
  ],
}) => {
  const user = useUser();
  const styles = useChatPanelStyles();
  const params = useParams<{ chatId: string }>();
  const documentId = params.chatId;
  const { getOrCreateSession, querySession, getSessionMessages } =
    useChatStore();

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAiMessageRef = useRef<string>("");
  const messageIdCounterRef = useRef<number>(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || !documentId) return;

    messageIdCounterRef.current += 1;
    const userMessageId = `user-${messageIdCounterRef.current}`;
    const aiMessageId = `ai-${messageIdCounterRef.current}`;

    const userMessage: Message = {
      id: userMessageId,
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    currentAiMessageRef.current = "";

    // Create placeholder AI message for streaming
    const aiMessage: Message = {
      id: aiMessageId,
      type: "ai",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, aiMessage]);

    try {
      // Get or create session
      const sessionId = await getOrCreateSession(documentId);

      // Query session with streaming
      await querySession(
        sessionId,
        messageText,
        (chunk: string) => {
          console.log("chunk", chunk);
          // Update the AI message with streaming chunks
          currentAiMessageRef.current += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, content: currentAiMessageRef.current }
                : msg
            )
          );
        },
        () => {
          // Streaming complete
          setIsLoading(false);
        },
        (error: Error) => {
          // Handle error
          console.error("Error querying session:", error);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    content:
                      msg.content ||
                      "Sorry, I encountered an error processing your question. Please try again.",
                  }
                : msg
            )
          );
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
      // Remove the empty AI message if there was an error
      setMessages((prev) => prev.filter((msg) => msg.id !== aiMessageId));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Load messages when documentId changes
  useEffect(() => {
    if (!documentId) return;

    let cancelled = false;

    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const sessionId = await getOrCreateSession(documentId);
        if (cancelled) return;

        const sessionMessages = await getSessionMessages(sessionId);
        if (cancelled) return;

        const formattedMessages: Message[] = sessionMessages.map((msg) => ({
          id: msg.id,
          type: msg.role === "assistant" ? "ai" : "user",
          content: msg.content,
          timestamp: msg.timestamp,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        if (!cancelled) {
          setIsLoadingMessages(false);
        }
      }
    };

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, [documentId, getOrCreateSession, getSessionMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <Text className={styles.chatTitle}>
          Hey, {user?.displayName || "friend"}!
        </Text>
        <Text className={styles.chatSubtitle}>
          Ask any question about this document
        </Text>
      </div>

      <div className={styles.chatMessages}>
        {isLoadingMessages ? (
          <div className={styles.emptyState}>
            <Spinner size="medium" />
            <Text className={styles.emptyStateText}>Loading messages...</Text>
          </div>
        ) : messages.length === 0 ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyStateTitle}>
              Start chatting with your PDF
            </Text>
            <Text className={styles.emptyStateText}>
              Ask questions about the content and I'll help you understand it
              better.
            </Text>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={styles.message}>
                {message.type === "ai" && (
                  <Avatar
                    name="AI"
                    color="brand"
                    size={32}
                    className={styles.aiAvatar}
                  />
                )}
                <div
                  className={
                    message.type === "user"
                      ? styles.userMessageContent
                      : styles.messageContent
                  }
                >
                  <div
                    className={`${styles.messageBubble} ${
                      message.type === "user" ? styles.userMessage : ""
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.type === "ai" && messages.indexOf(message) === 0 && (
                    <div className={styles.suggestedQuestions}>
                      {suggestedQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          className={styles.suggestedQuestion}
                          onClick={() => handleSendMessage(question)}
                        >
                          💡 {question}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {message.type === "user" && (
                  <Avatar name="You" color="colorful" size={32} />
                )}
              </div>
            ))}
            {isLoading && (
              <div className={styles.message}>
                <Avatar
                  name="AI"
                  color="brand"
                  size={32}
                  className={styles.aiAvatar}
                />
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>
                    <Spinner size="tiny" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className={styles.chatInput}>
        <div className={styles.inputContainer}>
          <Input
            className={styles.textInput}
            placeholder="Ask any question..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            size="large"
          />
          <Button
            appearance="primary"
            icon={<Send24Regular />}
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className={styles.sendButton}
          />
        </div>
      </div>
    </div>
  );
};
