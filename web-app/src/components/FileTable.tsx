import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import React from "react";
import type { FileDTO } from "../models/FileDTO";
import type { Breadcrumb } from "../types/Breadcrumb";

const FileTable: React.FC<{ files: FileDTO[]; setBreadcrumbs: any }> = ({
  files,
  setBreadcrumbs,
}) => {
  const handleDoubleClick = (file: FileDTO) => {
    if (file.isDirectory) {
      setBreadcrumbs((prevBreadcrumbs: Breadcrumb[]) => [
        ...prevBreadcrumbs,
        { id: file.id, name: file.name },
      ]);
    }
  };

  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="file table" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" align="center"></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Uploaded At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => (
            <TableRow
              key={"file_" + file.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.03)",
                },
              }}
              onDoubleClick={() => {
                handleDoubleClick(file);
              }}
            >
              <TableCell padding="checkbox" align="center">
                {file.isDirectory ? <FolderIcon /> : <DescriptionIcon />}
              </TableCell>
              <TableCell>{file.name}</TableCell>
              <TableCell>{file.uploadedAt.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FileTable;
