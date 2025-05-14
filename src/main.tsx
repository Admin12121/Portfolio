import { StrictMode } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/providers/theme";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
      >
        <App />
      </ThemeProvider>
    </Router>
  </StrictMode>,
);
