import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppPage from "./page/AppPage/AppPage";
import LoginPage from "./page/LoginPage/LoginPage";
import { RouteGuard } from "./component/RouteGuard";
import { useAuthenticatedUser } from "./provider/AuthenticatedUser";
import FilesContainer from "./container/FilesContainer/FilesContainer";
import SettingsContainer from "./container/SettingsContainer/SettingsContainer";

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
