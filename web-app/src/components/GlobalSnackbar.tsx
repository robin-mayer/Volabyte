import { Alert, Snackbar } from "@mui/material";

export interface GlobalSnackbarProps {
  snackbarOpen: boolean;
  setSnackbarOpen: (open: boolean) => void;
  message: string;
  severity: "success" | "error";
}

export function GlobalSnackbar(props: GlobalSnackbarProps) {
  return (
    <Snackbar
      open={props.snackbarOpen}
      autoHideDuration={2000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      onClose={() => props.setSnackbarOpen(false)}
    >
      <Alert severity={props.severity} variant="filled" sx={{ width: "100%" }}>
        {props.message}
      </Alert>
    </Snackbar>
  );
}
