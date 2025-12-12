import React from "react";
import type { UserRole } from "../types/UserRole";
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

const AdminCreateUserDialog: React.FC<{
  open: boolean;
  handleClose: any;
  handleSubmit: any;
}> = ({ open, handleClose, handleSubmit }) => {
  const [userName, setUserName] = React.useState<string>("");
  const [displayName, setDisplayName] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = React.useState<string>("");
  const [role, setRole] = React.useState<UserRole>("USER");

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
          fullWidth
          variant="outlined"
          onChange={(e) => setUserName(e.target.value.trim())}
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
          label="Password (min. 8 characters)"
          fullWidth
          variant="outlined"
          onChange={(e) => setPassword(e.target.value.trim())}
          type="password"
        />
        <TextField
          id="name"
          label="Repeat Password"
          fullWidth
          error={password != passwordConfirm}
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
            password.length === 0 ||
            password !== passwordConfirm
          }
          onClick={() => {
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
