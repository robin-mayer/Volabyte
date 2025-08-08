import {
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import Request from "../core/Request";
import type { LoginUserDTO } from "../models/LoginUserDTO";
import type { AuthDataDTO } from "../models/AuthDataDTO";
import type { UserDTO } from "../models/UserDTO";

const LoginPage: React.FC<{ setAuthUser: any }> = ({ setAuthUser }) => {
  const [userNameInput, setUserNameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    const loginData: LoginUserDTO = {
      userName: userNameInput,
      password: passwordInput,
    };

    const response = await Request.post("/users/login", null, loginData);
    if (response.status === 200) {
      const authData: AuthDataDTO = await response.json();
      const selfResponse = await Request.get(
        "/users/self",
        authData.accessToken
      );
      if (selfResponse.status === 200) {
        const user: UserDTO = await selfResponse.json();
        setAuthUser({
          accessToken: authData.accessToken,
          userId: user.userId,
          userName: user.userName,
          displayName: user.displayName,
          role: user.role,
        });
      } else {
        setErrorMessage(
          "Server is currently unavailable. Please try again later."
        );
      }
    } else if (response.status === 401) {
      // handle unauthorized access
      setErrorMessage("Invalid username or password");
    } else {
      // server unavailable
      setErrorMessage(
        "Server is currently unavailable. Please try again later."
      );
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1rem",
            width: "30%",
            padding: "3rem",
          }}
        >
          <Typography variant="h3" sx={{ mb: "1rem" }}>
            Volabyte
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            sx={{ width: "100%" }}
            onChange={(e) => setUserNameInput(e.target.value.trim())}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            sx={{ width: "100%" }}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button
            variant="contained"
            sx={{ width: "100%" }}
            disabled={!userNameInput || !passwordInput}
            onClick={handleLogin}
          >
            Login
          </Button>
        </Paper>
      </Box>
      <Snackbar
        open={errorMessage != null}
        autoHideDuration={7500}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        onClose={() => setErrorMessage(null)}
        message={errorMessage}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setErrorMessage(null)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </>
  );
};

export default LoginPage;
