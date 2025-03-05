import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ConfigProvider } from "./Context/configContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const fetchConfig = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/config");
    const config = await response.json();
    return config;
  } catch (error) {
    console.error("Failed to fetch config:", error);
    return {};
  }
};

fetchConfig().then((config) => {
  root.render(
    <React.StrictMode>
      <ConfigProvider config={config}>
        <App />
      </ConfigProvider>
    </React.StrictMode>
  );
});

reportWebVitals();
