import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={
        "1023833400712-3nd3kso77qds8dqebuckjp3v4cbcdb7f.apps.googleusercontent.com"
      }
    >
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
