import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppPage from "./pages/AppPage/AppPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import FilesContainer from "./pages/AppPage/outlets/FilesContainer/FilesContainer";
import SettingsContainer from "./pages/AppPage/outlets/SettingsContainer.tsx/SettingsContainer";
import { useAuthenticatedUser } from "./provider/AuthenticatedUser";

function App() {
  const authenticatedUser = useAuthenticatedUser();

  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              authenticatedUser.getAuthenticatedUser() ? (
                <Navigate to="/" />
              ) : (
                <LoginPage />
              )
            }
          />
          {authenticatedUser.getAuthenticatedUser() ? (
            <Route path="/" element={<AppPage />}>
              <Route index element={<Navigate to="files" replace />} />
              <Route path="files" element={<FilesContainer />} />
              <Route path="settings" element={<SettingsContainer />} />
            </Route>
          ) : (
            <Route path="/" element={<Navigate to="/login" replace />} />
          )}
          <Route
            path="*"
            element={
              <Navigate
                to={authenticatedUser.getAuthenticatedUser() ? "/" : "/login"}
                replace
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
