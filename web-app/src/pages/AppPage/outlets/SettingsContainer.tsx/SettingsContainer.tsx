import { Box, Divider, Typography } from "@mui/material";
import AdminUsersSettings from "./components/AdminUsersSettings";

const SettingsContainer: React.FC<{
  accessToken: string;
  setSnackbarProps: any;
}> = ({ accessToken, setSnackbarProps }) => {
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
      <AdminUsersSettings
        accessToken={accessToken}
        setSnackbarProps={setSnackbarProps}
      />
    </Box>
  );
};

export default SettingsContainer;
