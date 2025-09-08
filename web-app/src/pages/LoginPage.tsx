import { Alert, Box, Button, Paper, Snackbar, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Request from "../core/Request";
import type { LoginUserDTO } from "../models/LoginUserDTO";
import type { AuthDataDTO } from "../models/AuthDataDTO";
import type { UserDTO } from "../models/UserDTO";
import LocalStorage from "../core/LocalStorage";

const LoginPage: React.FC<{ setAuthUser: any }> = ({ setAuthUser }) => {
  const [userNameInput, setUserNameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSnackBar, setShowSnackbar] = useState<boolean>(false);

  const errorMessageWrongCredentials = "Invalid username or password";
  const errorMessageServerError =
    "Server is currently unavailable. Please try again later.";

  useEffect(() => {
    setErrorMessage(null);
    setShowSnackbar(false);
  }, [userNameInput, passwordInput]);

  const handleLogin = async () => {
    const loginData: LoginUserDTO = {
      userName: userNameInput,
      password: passwordInput,
      deviceId: LocalStorage.getDeviceId(),
      deviceName: navigator.userAgent,
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
          accessTokenExpiresAt: authData.accessTokenExpiresAt,
          refreshToken: authData.refreshToken,
          refreshTokenExpiresAt: authData.refreshTokenExpiresAt,
          id: user.id,
          userName: user.userName,
          displayName: user.displayName,
          role: user.role,
        });
      } else {
        setErrorMessage(errorMessageServerError);
        setShowSnackbar(true);
      }
    } else if (response.status === 401) {
      setErrorMessage(errorMessageWrongCredentials);
      setShowSnackbar(true);
    } else {
      setErrorMessage(errorMessageServerError);
      setShowSnackbar(true);
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
            maxWidth: "450px",
            minWidth: "400px",
            padding: "3rem",
          }}
        >
          <img src="/images/logo_256.png" alt="Volabyte logo" height="50px" />
          <TextField
            label="Username"
            variant="outlined"
            sx={{ width: "100%", mt: "1rem" }}
            onChange={(e) => setUserNameInput(e.target.value.trim())}
            error={errorMessage === errorMessageWrongCredentials}
            autoFocus
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            sx={{ width: "100%" }}
            onChange={(e) => setPasswordInput(e.target.value)}
            error={errorMessage === errorMessageWrongCredentials}
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
        open={errorMessage != null && showSnackBar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert severity="error" variant="filled" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;
