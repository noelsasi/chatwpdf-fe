import { makeStyles, tokens } from "@fluentui/react-components";

export const useChatPanelStyles = makeStyles({
  chatPanel: {
    flex: "0 0 40%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  chatHeader: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 24px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "#fafafa",
  },
  chatTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },
  chatSubtitle: {
    fontSize: "12px",
    color: "#666",
    marginTop: "4px",
  },
  chatMessages: {
    flex: 1,
    overflow: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  message: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  messageContent: {
    flex: 1,
  },
  messageBubble: {
    backgroundColor: "#f5f5f5",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#333",
  },
  userMessage: {
    backgroundColor: "#7C3AED",
    color: "white",
  },
  aiAvatar: {
    backgroundColor: "#7C3AED",
    color: "white",
  },
  suggestedQuestions: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "12px",
  },
  suggestedQuestion: {
    backgroundColor: "white",
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
  },
  chatInput: {
    padding: "20px 24px",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: "white",
  },
  inputContainer: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
  },
  textInput: {
    flex: 1,
  },
  sendButton: {
    minWidth: "48px",
    height: "48px",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    textAlign: "center",
  },
  emptyStateTitle: {
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#333",
  },
  emptyStateText: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "24px",
    lineHeight: "1.5",
  },
});

