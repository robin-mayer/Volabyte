import { createContext, useContext, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

type SnackbarAPI = {
  show: (message: string, severity: "success" | "error") => void;
};

const SnackbarContext = createContext<SnackbarAPI | null>(null);

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
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<"success" | "error">("error");

  const api = {
    show: (msg: string, severity: "success" | "error") => {
      setMessage(msg);
      setSeverity(severity);
      setOpen(true);
    },
  };

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setOpen(false)}
      >
        <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
