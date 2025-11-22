import { makeStyles, tokens } from "@fluentui/react-components";

export const usePDFViewerStyles = makeStyles({
  pdfPanel: {
    flex: "0 0 60%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  pdfHeader: {
    padding: "16px 24px",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  pdfTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    flex: 1,
  },
  pdfControls: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#666",
    padding: "0 12px",
  },
  pdfContent: {
    flex: 1,
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "20px",
    backgroundColor: "#e5e5e5",
  },
  pdfDocument: {
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
});

