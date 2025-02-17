import React from "react";
import ReactDOM from "react-dom/client"; // Correct import for React 19+
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css"; // Ensure Tailwind styles are applied


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
