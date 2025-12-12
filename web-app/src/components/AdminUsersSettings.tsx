import React, { useEffect } from "react";
import {
  Box,
  Button,
  Paper,
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

const AdminUsersSettings: React.FC<{ accessToken: string }> = ({
  accessToken,
}) => {
  const [users, setUsers] = React.useState<UserDTO[]>([]);

  useEffect(() => {
    Request.get("/users", accessToken).then((response) => {
      if (response.status === 200) {
        response.json().then((data: UserDTO[]) => {
          setUsers(data);
        });
      }
    });
  }, []);

  return (
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
        <Table aria-label="file table" stickyHeader>
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
      <Button variant="contained">Create new user</Button>
    </Box>
  );
};

export default AdminUsersSettings;
