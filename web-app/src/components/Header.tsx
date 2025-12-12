import React from "react";
import {
  Alert,
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
} from "@mui/material";
import { Settings, Logout } from "@mui/icons-material";
import type { AuthUser } from "../models/AuthUser";
import AuthUserImpl from "../core/AuthUserImpl";
import { useNavigate } from "react-router-dom";

const Header: React.FC<{
  height: number;
  authUser: AuthUser;
  setAuthUser: any;
}> = ({ height, authUser, setAuthUser }) => {
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  let navigate = useNavigate();

  return (
    <React.Fragment>
      <Box
        sx={{
          height: `${height}rem`,
          paddingRight: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          sx={{ width: "35%" }}
        />
        <React.Fragment>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {authUser.displayName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            slotProps={{
              paper: {
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&::before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 18,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/settings");
              }}
            >
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                AuthUserImpl.logout(authUser.accessToken).then((result) => {
                  if (result) {
                    setAuthUser(null);
                  } else {
                    setShowSnackbar(true);
                  }
                });
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </React.Fragment>
      </Box>
      <Snackbar
        open={showSnackBar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          Something wen't wrong. Please try again later.
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default Header;
