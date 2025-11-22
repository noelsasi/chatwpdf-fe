import {
  Button,
  Hamburger,
  makeStyles,
  tokens,
  Tooltip,
} from "@fluentui/react-components";
import {
  Add24Regular,
  Person24Regular,
  Premium24Regular,
} from "@fluentui/react-icons";
import { useChatStore } from "../store/chatStore";
import React from "react";
import { useNavigate } from "react-router-dom";
import SignupPopup from "../components/SignupPopup";
import { useUser } from "@stackframe/react";

const useStyles = makeStyles({
  root: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fafafa",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 24px",
    backgroundColor: "white",
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#7C3AED",
  },
  logoIcon: {
    width: "32px",
    height: "32px",
    backgroundColor: "#7C3AED",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "20px",
    fontWeight: "700",
  },
  headerButtons: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  languageSelector: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
});

function Header({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
}) {
  const styles = useStyles();
  const navigate = useNavigate();
  const { uploadPdf } = useChatStore();
  const [isSignupOpen, setIsSignupOpen] = React.useState(false);
  const user = useUser();

  const handleUploadPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) {
      return;
    }
    try {
      await uploadPdf(file, (id: string) => {
        navigate(`/chat/${id}`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignOut = () => {
    user?.signOut();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>C</div>
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          ChatPDF
        </span>
        <Tooltip
          content={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          relationship="label"
        >
          <Hamburger onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </Tooltip>
        <Button
          appearance="outline"
          icon={<Add24Regular />}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept="application/pdf"
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: 0,
              height: 0,
            }}
            onChange={handleUploadPDF}
          />
          Upload PDF
        </Button>
      </div>
      <div className={styles.headerButtons}>
        <Button appearance="transparent" icon={<Premium24Regular />}>
          Premium
        </Button>
        {user ? (
          <Button
            appearance="outline"
            icon={<Person24Regular />}
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        ) : (
          <Button
            appearance="outline"
            icon={<Person24Regular />}
            onClick={() => setIsSignupOpen(true)}
          >
            Sign up
          </Button>
        )}
      </div>
      <SignupPopup
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />
    </header>
  );
}

export default Header;
