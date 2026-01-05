import { Box, Button, Paper, TextField } from "@mui/material";
import React from "react";
import Request from "../../core/Request";
import type { LoginUserDTO } from "../../models/LoginUserDTO";
import type { AuthDataDTO } from "../../models/AuthDataDTO";
import type { UserDTO } from "../../models/UserDTO";
import LocalStorage from "../../core/LocalStorage";

const LoginPage: React.FC<{ setAuthUser: any; setSnackbarProps: any }> = ({
  setAuthUser,
  setSnackbarProps,
}) => {
  const [userNameInput, setUserNameInput] = React.useState<string>("");
  const [passwordInput, setPasswordInput] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  /*React.useEffect(() => {
    console.log("Error message changed:", errorMessage);
    if (errorMessage) {
      console.log("Setting snackbar:", errorMessage);
      setSnackbarProps({
        message: errorMessage,
        severity: "error",
      });
    }
  }, [errorMessage]);*/
  React.useEffect(() => {
    setSnackbarProps(null);
  }, [userNameInput, passwordInput]);

  const errorMessageWrongCredentials = "Invalid username or password";
  const errorMessageServerError =
    "Server is currently unavailable. Please try again later.";

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
        setSnackbarProps({
          message: errorMessageServerError,
          severity: "error",
        });
      }
    } else if (response.status === 401) {
      setErrorMessage(errorMessageWrongCredentials);
      setSnackbarProps({
        message: errorMessageWrongCredentials,
        severity: "error",
      });
    } else {
      setErrorMessage(errorMessageServerError);
      setSnackbarProps({
        message: errorMessageServerError,
        severity: "error",
      });
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
    </>
  );
};

export default LoginPage;
