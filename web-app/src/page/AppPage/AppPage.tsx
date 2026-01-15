import { FileUploaderProvider } from "../../provider/FileUploader";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const AppPage = () => {
  const headerHeightInRem = 4;

  return (
    <FileUploaderProvider>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar height={headerHeightInRem} />
        <Box sx={{ width: "100%" }}>
          <Header height={headerHeightInRem} />
          <Box
            sx={{
              width: "100%",
              height: `calc(100vh - ${headerHeightInRem}rem)`,
              border: "1px solid rgba(0, 0, 0, 0.12)",
              borderTopLeftRadius: "8px",
              py: "1.5rem",
              px: "2rem",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </FileUploaderProvider>
  );
};

export default AppPage;
