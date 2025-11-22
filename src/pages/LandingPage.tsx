import { makeStyles, Text, tokens } from "@fluentui/react-components";
import PdfUpload from "../features/pdf-upload/PdfUpload";
import React from "react";
import { api } from "../lib/api";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    maxWidth: "1200px",
    margin: "0 auto",
    width: "100%",
  },
  badges: {
    display: "flex",
    gap: "40px",
    marginBottom: "40px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    textAlign: "center",
  },
  badgeLabel: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "4px",
  },
  badgeValue: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
  title: {
    fontSize: "56px",
    fontWeight: "700",
    marginBottom: "20px",
    textAlign: "center",
    lineHeight: "1.2",
  },
  pdfHighlight: {
    color: "white",
    backgroundColor: "#7C3AED",
    padding: "4px 16px",
    borderRadius: "12px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#666",
    marginBottom: "60px",
    textAlign: "center",
    maxWidth: "700px",
    lineHeight: "1.6",
  },
  link: {
    color: "#7C3AED",
    textDecoration: "underline",
  },
  footer: {
    padding: "60px 40px",
    backgroundColor: "white",
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  footerTitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  },
  institutions: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "60px",
    flexWrap: "wrap",
  },
  institution: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
  },
});

export default function LandingPage() {
  const styles = useStyles();

  const testConnection = async () => {
    const response = await api.get("/api/health/db");
    console.log(response.data);
  };

  React.useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <div className={styles.badges}>
          <div className={styles.badge}>
            <div className={styles.badgeLabel}>#1 PDF Chat AI</div>
            <div className={styles.badgeValue}>Original</div>
          </div>
          <div className={styles.badge}>
            <div className={styles.badgeLabel}>Q's answered every day</div>
            <div className={styles.badgeValue}>1,000,000+</div>
          </div>
          <div className={styles.badge}>
            <div className={styles.badgeLabel}>Gen AI apps of 2024</div>
            <div className={styles.badgeValue}>Top 50</div>
          </div>
        </div>

        <h1 className={styles.title}>
          Chat with any <span className={styles.pdfHighlight}>PDF</span>
        </h1>

        <Text className={styles.subtitle}>
          Join millions of{" "}
          <span className={styles.link}>
            students, researchers and professionals
          </span>{" "}
          to instantly answer questions and understand research with AI
        </Text>

        <PdfUpload />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerTitle}>
            Trusted by students and researchers from top institutions
          </div>
          <div className={styles.institutions}>
            <div className={styles.institution}>🏛️ Johns Hopkins</div>
            <div className={styles.institution}>🎓 Stanford University</div>
            <div className={styles.institution}>🏫 Yale</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
