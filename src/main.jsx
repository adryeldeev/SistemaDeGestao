import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UIProvider } from "./Context/UIContext.jsx"; // Corrigido para UIProvider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UIProvider>
    <React.StrictMode>
      <App />
      <ToastContainer />
    </React.StrictMode>
  </UIProvider>
);
