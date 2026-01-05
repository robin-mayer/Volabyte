import React from "react";
import type { AuthUser } from "./models/AuthUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppPage from "./pages/AppPage/AppPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import LocalStorage from "./core/LocalStorage";
import FilesContainer from "./pages/AppPage/outlets/FilesContainer/FilesContainer";
import { Alert, Box, Snackbar } from "@mui/material";
import LoadingSpinner from "./global_components/LoadingSpinner";
import AuthUserImpl from "./core/AuthUserImpl";
import SettingsContainer from "./pages/AppPage/outlets/SettingsContainer.tsx/SettingsContainer";
import type { SnackbarProps } from "./interfaces/SnackbarProps";

function App() {
  const [loading, setLoading] = React.useState(true);
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [snackbarProps, setSnackbarProps] =
    React.useState<SnackbarProps | null>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  React.useEffect(() => {
    AuthUserImpl.initialize().then((authUser) => {
      setAuthUser(authUser);
      setLoading(false);
    });
  }, []);

  React.useEffect(() => {
    if (authUser) {
      LocalStorage.persistRefreshToken(authUser);

      const timeUntilExpiry =
        new Date(authUser.accessTokenExpiresAt).getTime() -
        new Date().getTime();
      setTimeout(() => {
        AuthUserImpl.refresh(authUser.refreshToken).then(
          (refreshedAuthUser) => {
            setAuthUser(refreshedAuthUser);
          }
        );
      }, timeUntilExpiry - 60000); // refresh 1 minute before expiry
    }
  }, [authUser]);

  React.useEffect(() => {
    if (snackbarProps) {
      setSnackbarOpen(true);
    }
  }, [snackbarProps]);

  return (
    <React.Fragment>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffffff",
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingSpinner />
        </Box>
      )}
      <Snackbar
        open={snackbarOpen && snackbarProps != null}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={snackbarProps?.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarProps?.message}
        </Alert>
      </Snackbar>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              authUser ? (
                <Navigate to="/" />
              ) : (
                <LoginPage
                  setAuthUser={setAuthUser}
                  setSnackbarProps={setSnackbarProps}
                />
              )
            }
          />
          {authUser ? (
            <Route
              path="/"
              element={
                <AppPage
                  authUser={authUser}
                  setAuthUser={setAuthUser}
                  setSnackbarProps={setSnackbarProps}
                />
              }
            >
              <Route index element={<Navigate to="files" replace />} />
              <Route
                path="files"
                element={
                  <FilesContainer
                    accessToken={authUser?.accessToken}
                    setSnackbarProps={setSnackbarProps}
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <SettingsContainer
                    accessToken={authUser?.accessToken}
                    setSnackbarProps={setSnackbarProps}
                  />
                }
              />
            </Route>
          ) : (
            <Route path="/" element={<Navigate to="/login" replace />} />
          )}
          <Route
            path="*"
            element={<Navigate to={authUser ? "/" : "/login"} replace />}
          />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
