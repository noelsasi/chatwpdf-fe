import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import LandingPage from "./pages/LandingPage";
import PDFViewerPage from "./pages/PdfViewerPage";
import AppLayout from "./layout/AppLayout";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { stackApp } from "./lib/stack";
import TodosPage from "./pages/TodosPage";

function HandlerRoutes() {
  const location = useLocation();

  return <StackHandler location={location.pathname} fullPage />;
}

function App() {
  return (
    <StackProvider app={stackApp}>
      <StackTheme>
        <FluentProvider theme={webLightTheme}>
          <BrowserRouter>
            <Routes>
              <Route path="/handler/*" element={<HandlerRoutes />} />
              <Route path="/" element={<AppLayout />}>
                <Route path="/" element={<TodosPage />} />
                <Route path="/todos" element={<TodosPage />} />
                <Route path="/chat/:chatId" element={<PDFViewerPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </FluentProvider>
      </StackTheme>
    </StackProvider>
  );
}

export default App;
