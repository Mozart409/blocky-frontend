import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import "@total-typescript/ts-reset";
import { Toaster } from "react-hot-toast";
import { ReactQueryDevtools } from "react-query/devtools";
import "@total-typescript/ts-reset";

const queryClient = new QueryClient();
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <Toaster />
    </React.StrictMode>,
  );
} else {
  console.error("Root element not found");
}
