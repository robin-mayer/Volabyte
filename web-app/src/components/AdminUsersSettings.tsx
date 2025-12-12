import React, { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import type { UserDTO } from "../models/UserDTO";
import Request from "../core/Request";
import { DeleteOutline, Edit } from "@mui/icons-material";
import AdminCreateUserDialog from "./AdminCreateUserDialog";
import type { CreateUserDTO } from "../models/CreateUserDTO";
import type { UserRole } from "../types/UserRole";

const AdminUsersSettings: React.FC<{ accessToken: string }> = ({
  accessToken,
}) => {
  const [users, setUsers] = React.useState<UserDTO[]>([]);
  const [openCreateUserDialog, setOpenCreateUserDialog] =
    React.useState<boolean>(false);
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);
  const [snackbarText, setSnackbarText] = React.useState<string | null>(null);

  useEffect(() => {
    Request.get("/users", accessToken).then((response) => {
      if (response.status === 200) {
        response.json().then((data: UserDTO[]) => {
          setUsers(data);
        });
      }
    });
  }, []);

  const createUser = async (
    userName: string,
    displayName: string,
    password: string,
    role: UserRole
  ) => {
    const createUserDTO: CreateUserDTO = {
      userName,
      displayName,
      password,
      role: role,
    };
    const response = await Request.post("/users", accessToken, createUserDTO);
    if (response.status === 201) {
      const createdUser: UserDTO = await response.json();
      const updatedUsers = [...users, createdUser].sort((a, b) =>
        a.userName.localeCompare(b.userName)
      );
      setUsers(updatedUsers);
      setOpenCreateUserDialog(false);
      setSnackbarText(`User ${createdUser.userName} created successfully.`);
    } else {
      setOpenCreateUserDialog(false);
      setSnackbarText("Failed to create user. Please try again.");
    }
    setShowSnackbar(true);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="h5">Users</Typography>
        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table aria-label="users table" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Display Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Last login</TableCell>
                <TableCell padding="checkbox" align="center"></TableCell>
                <TableCell padding="checkbox" align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={"user_" + user.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.displayName}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {user.lastLoginAt ? user.lastLoginAt.toString() : "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                      },
                    }}
                    onClick={() => {
                      console.error(
                        "Wants to edit user with id: " +
                          user.id +
                          ". Not implemented yet."
                      );
                    }}
                  >
                    <Edit />
                  </TableCell>
                  <TableCell
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                      },
                    }}
                    onClick={() => {
                      console.error(
                        "Wants to delete user with id: " +
                          user.id +
                          ". Not implemented yet."
                      );
                    }}
                  >
                    <DeleteOutline />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button onClick={() => setOpenCreateUserDialog(true)}>
          Create new user
        </Button>
      </Box>
      <AdminCreateUserDialog
        open={openCreateUserDialog}
        handleClose={() => setOpenCreateUserDialog(false)}
        handleSubmit={createUser}
        existingUsers={users}
      />
      <Snackbar
        open={snackbarText !== null && showSnackBar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        autoHideDuration={2000}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert
          severity={snackbarText?.startsWith("User") ? "success" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default AdminUsersSettings;
