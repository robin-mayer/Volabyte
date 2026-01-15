import { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

export type SnackbarAPI = {
  show: (message: string, severity: "success" | "error") => void;
};

export const SnackbarContext = createContext<SnackbarAPI | null>(null);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};

export const SnackbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<"success" | "error">("error");

  const api = {
    show: (msg: string, severity: "success" | "error") => {
      setMessage(msg);
      setSeverity(severity);
    },
  };

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      {message && (
        <Snackbar
          open={message != null}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          onClose={() => setMessage(null)}
        >
          <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};
