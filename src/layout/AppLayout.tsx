import React from "react";
import type { JSXElement } from "@fluentui/react-components";
import {
  NavDrawer,
  NavDrawerBody,
  NavItem,
  NavSectionHeader,
} from "@fluentui/react-components";

import { makeStyles } from "@fluentui/react-components";
import { Document20Regular } from "@fluentui/react-icons";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { useChatStore, type Chat } from "../store/chatStore";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#fafafa",
  },
  content: {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  main: {
    flex: 1,
    overflow: "auto",
  },
});

export default function AppLayout(): JSXElement {
  const styles = useStyles();
  const navigate = useNavigate();
  const params = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const { chatHistory, setPdfInfo } = useChatStore();

  const handleChatClick = (chat: Chat) => {
    navigate(`/chat/${chat.id}`);
    setPdfInfo({
      fileName: chat.fileName,
      fileUrl: chat.fileUrl,
    });
  };

  React.useEffect(() => {
    if (params.chatId) {
      const fileInfo = chatHistory.find((chat) => chat.id === params.chatId);
      if (fileInfo) {
        setPdfInfo({
          fileName: fileInfo.fileName,
          fileUrl: fileInfo.fileUrl,
        });
      }
    }
  }, [params.chatId, chatHistory, setPdfInfo]);

  // React.useEffect(() => {
  //   getChatDocuments();
  // }, []);

  return (
    <div className={styles.root}>
      <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className={styles.content}>
        <NavDrawer
          selectedValue={params.chatId || undefined}
          open={isSidebarOpen}
          type="inline"
        >
          <NavDrawerBody>
            <NavSectionHeader>Chats</NavSectionHeader>
            {chatHistory.map((item) => (
              <NavItem
                key={item.id}
                value={item.id}
                icon={<Document20Regular />}
                onClick={() => handleChatClick(item)}
              >
                {item.fileName}
              </NavItem>
            ))}
          </NavDrawerBody>
        </NavDrawer>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
