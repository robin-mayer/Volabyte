import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
  Typography,
  Link,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useNavigate } from "react-router-dom";
import packageJson from "../../../../package.json";

const drawerWidth = 200;

const Sidebar: React.FC<{ height: number }> = ({ height }) => {
  let navigate = useNavigate();

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          border: "none",
          display: "flex",
          flexDirection: "column",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box
        sx={{
          height: `${height}rem`,
          display: "flex",
          alignItems: "center",
          pl: "1rem",
        }}
      >
        <img src="/images/logo_128.png" alt="Volabyte logo" width="140px" />
      </Box>
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          pt: "4rem",
          pb: "1rem",
        }}
      >
        <List sx={{ width: "100%" }}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/files")}>
              <ListItemIcon>
                <Inventory2Icon />
              </ListItemIcon>
              <ListItemText primary={"Files"} />
            </ListItemButton>
          </ListItem>
        </List>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Link
            href="https://github.com/robin-mayer/Volabyte"
            target="_blank"
            rel="noreferrer"
            color="textPrimary"
          >
            <Typography variant="body2" gutterBottom>
              GitHub
            </Typography>
          </Link>
          <Typography variant="body2" color="textSecondary">
            Version {packageJson.version}
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
