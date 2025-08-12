import { useEffect, useState } from "react";
import type { AuthUser } from "./models/AuthUser";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import LocalStorage from "./core/LocalStorage";

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
        <Route
          path="/"
          element={
            authUser ? (
              <DashboardPage authUser={authUser} setAuthUser={setAuthUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
