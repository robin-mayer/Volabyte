import { Box, Divider, Typography } from "@mui/material";
import AdminUsersSettings from "./components/AdminUsersSettings";

const SettingsContainer = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "1rem",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Divider />
      <AdminUsersSettings />
    </Box>
  );
};

export default SettingsContainer;
