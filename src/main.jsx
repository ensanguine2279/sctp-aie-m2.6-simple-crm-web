import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CustomerProvider } from "./contexts/CustomerContext.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CustomerProvider>
        <App />
      </CustomerProvider>
    </AuthProvider>
  </StrictMode>,
);
