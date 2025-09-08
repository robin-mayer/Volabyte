import React from "react";
import type { AuthUser } from "./models/AuthUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LocalStorage from "./core/LocalStorage";
import FilesContainer from "./container/FilesContainer";
import { Box } from "@mui/material";
import LoadingSpinner from "./components/LoadingSpinner";
import AuthUserImpl from "./core/AuthUserImpl";

function App() {
  const [loading, setLoading] = React.useState(true);
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);

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
    AuthUserImpl.initialize().then((authUser) => {
      setAuthUser(authUser);
      setLoading(false);
    });
  }, []);

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
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              authUser ? (
                <Navigate to="/" />
              ) : (
                <LoginPage setAuthUser={setAuthUser} />
              )
            }
          />
          {authUser ? (
            <Route
              path="/"
              element={
                <DashboardPage authUser={authUser} setAuthUser={setAuthUser} />
              }
            >
              <Route index element={<Navigate to="files" replace />} />
              <Route
                path="files"
                element={<FilesContainer accessToken={authUser?.accessToken} />}
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
