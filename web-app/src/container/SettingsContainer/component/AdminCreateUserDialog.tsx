import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { UserDTO } from "../../../model/UserDTO";
import type { UserRole } from "../../../model/UserRole";

const AdminCreateUserDialog: React.FC<{
  open: boolean;
  handleClose: any;
  handleSubmit: any;
  existingUsers: UserDTO[];
}> = ({ open, handleClose, handleSubmit, existingUsers }) => {
  const [userName, setUserName] = React.useState<string>("");
  const [displayName, setDisplayName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>("");
  const [role, setRole] = React.useState<UserRole>("USER");
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const close = () => {
    handleClose();
    resetFields();
  };

  const resetFields = () => {
    setTimeout(() => {
      setUserName("");
      setDisplayName("");
      setPassword("");
      setPasswordConfirm("");
      setRole("USER");
    }, 300);
  };

  const userNameExists = existingUsers.some(
    (existingUser) => existingUser.userName === userName
  );

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          width: "400px",
          py: "0.4rem !important",
        }}
      >
        <TextField
          autoFocus
          id="name"
          label="Username"
          value={userName}
          fullWidth
          variant="outlined"
          error={userNameExists && !submitted}
          helperText={userNameExists ? "Username already exists" : null}
          onChange={(e) => {
            const validated = e.target.value
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]/g, "");
            setUserName(validated);
          }}
        />
        <TextField
          id="name"
          label="Display Name"
          fullWidth
          variant="outlined"
          onChange={(e) => setDisplayName(e.target.value.trim())}
        />
        <TextField
          id="name"
          label="Password"
          fullWidth
          variant="outlined"
          error={password.length > 0 && password.length < 8}
          helperText={
            password.length > 0 && password.length < 8
              ? "Password must be at least 8 characters"
              : null
          }
          onChange={(e) => setPassword(e.target.value.trim())}
          type="password"
        />
        <TextField
          id="name"
          label="Repeat Password"
          fullWidth
          error={passwordConfirm.length > 0 && password != passwordConfirm}
          helperText={
            passwordConfirm.length > 0 && password != passwordConfirm
              ? "Passwords do not match"
              : null
          }
          variant="outlined"
          type="password"
          onChange={(e) => setPasswordConfirm(e.target.value.trim())}
        />
        <FormControl fullWidth>
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Role"
            onChange={(e) => setRole(e.target.value as UserRole)}
          >
            <MenuItem value={"USER"}>User</MenuItem>
            <MenuItem value={"ADMIN"}>Admin</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            close();
          }}
        >
          Cancel
        </Button>
        <Button
          disabled={
            userName.length === 0 ||
            displayName.length === 0 ||
            password.length < 8 ||
            password !== passwordConfirm ||
            userNameExists
          }
          onClick={() => {
            setSubmitted(true);
            handleSubmit(userName, displayName, password, role);
            resetFields();
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCreateUserDialog;
