import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { SnackbarProvider } from "./provider/Snackbar.tsx";
import { AuthenticatedUserProvider } from "./provider/AuthenticatedUser.tsx";

createRoot(document.getElementById("root")!).render(
  <SnackbarProvider>
    <AuthenticatedUserProvider>
      <App />
    </AuthenticatedUserProvider>
  </SnackbarProvider>
);
