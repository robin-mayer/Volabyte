import { useEffect, useState } from "react";
import type { AuthUser } from "./models/AuthUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LocalStorage from "./core/LocalStorage";
import FilesContainer from "./container/FilesContainer";

function App() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(
    LocalStorage.getInitialAuthUser()
  );

  useEffect(() => {
    LocalStorage.persistAuthUser(authUser);
  }, [authUser]);

  return (
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
  );
}

export default App;
