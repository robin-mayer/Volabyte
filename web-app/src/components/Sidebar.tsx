import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  Box,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";

const drawerWidth = 240;

const Sidebar: React.FC<{ height: number }> = ({ height }) => {
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
          mb: "4rem",
          pl: "1rem",
        }}
      >
        <img
          src="public/images/logo_128.png"
          alt="Volabyte logo"
          width="140px"
        />
      </Box>

      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <Inventory2Icon />
            </ListItemIcon>
            <ListItemText primary={"Files"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List sx={{ justifySelf: "flex-end" }}>
        <ListItemButton
          component="a"
          href="https://github.com/dein-username/dein-repo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ListItemIcon>
            <Inventory2Icon />
          </ListItemIcon>
          <ListItemText primary="GitHub" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
