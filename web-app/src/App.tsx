import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppPage from "./pages/AppPage/AppPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import FilesContainer from "./pages/AppPage/outlets/FilesContainer/FilesContainer";
import SettingsContainer from "./pages/AppPage/outlets/SettingsContainer.tsx/SettingsContainer";
import { RouteGuard } from "./component/RouteGuard";
import { useAuthenticatedUser } from "./provider/AuthenticatedUser";

function App() {
  const authenticatedUser = useAuthenticatedUser();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            authenticatedUser.getAuthenticatedUser() ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage />
            )
          }
        />
        <Route element={<RouteGuard />}>
          <Route path="/" element={<AppPage />}>
            <Route index element={<Navigate to="files" replace />} />
            <Route path="files" element={<FilesContainer />} />
            <Route path="settings" element={<SettingsContainer />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
