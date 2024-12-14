import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "react-query";
import "./i18n/i18n"; // Import the i18n configuration
import "./index.css";
import { queryClient } from "@/api/api.ts";
import { Provider } from "react-redux";
import store from "@/app/store";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
