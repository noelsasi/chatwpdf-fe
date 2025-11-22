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
  initialMessages = [
    {
      id: "1",
      type: "ai",
      content:
        "Hey, friend!\n\nThis tracker helps you keep up with your habits every day of the month. It's super simple and neat so you can easily mark your progress and see your results at the end.\n\nŠikat kere te updejtov haj?",
      timestamp: new Date(),
    },
  ],
  suggestedQuestions = [
    "Summarize o tracker thaj hoj dikhav kako o tracker kerel kaj?",
    "So sikav te inportantno te trackinav habits regularly?",
    "Kako mešav te optimizirav o tracker te del me te ken?",
  ],
}) => {
  const styles = useChatPanelStyles();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: new Date().getTime().toString(),
      type: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Thank you for your question: "${messageText}". This is a simulated response. In a real application, this would be powered by an AI that analyzes the PDF content and provides relevant answers.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <Text className={styles.chatTitle}>Hey, friend!</Text>
        <Text className={styles.chatSubtitle}>
          Ask any question about this document
        </Text>
      </div>

      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
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
                <div className={styles.messageContent}>
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
