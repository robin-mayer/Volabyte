import React from "react";
import Header from "../components/Header";
import type { AuthUser } from "../models/AuthUser";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";

const DashboardPage: React.FC<{ authUser: AuthUser; setAuthUser: any }> = ({
  authUser,
  setAuthUser,
}) => {
  const headerHeight = 4;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Sidebar height={headerHeight} />
      <Box sx={{ width: "100%" }}>
        <Header
          height={headerHeight}
          authUser={authUser}
          setAuthUser={setAuthUser}
        />
        <Box
          sx={{
            width: "100%",
            height: `calc(100% - ${headerHeight}rem)`,
            border: "1px solid rgba(0, 0, 0, 0.12)",
            borderTopLeftRadius: "10px",
          }}
        ></Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;
