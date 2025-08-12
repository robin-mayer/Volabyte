import type React from "react";
import Header from "../components/Header";
import type { AuthUser } from "../models/AuthUser";

const DashboardPage: React.FC<{ authUser: AuthUser; setAuthUser: any }> = ({
  authUser,
  setAuthUser,
}) => {
  return <Header authUser={authUser} setAuthUser={setAuthUser} />;
};

export default DashboardPage;
