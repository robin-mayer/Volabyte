import { Box, Typography } from "@mui/material";

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
      <Typography variant="h4">Settings</Typography>
      <Typography variant="h5">Users</Typography>
    </Box>
  );
};

export default SettingsContainer;
