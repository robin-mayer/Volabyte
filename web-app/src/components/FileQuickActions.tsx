import React from "react";
import UploadSpeedDial from "../components/UploadSpeedDial";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CreateFolderDialog from "../components/CreateFolderDialog";
import type { CreateDirectoryDTO } from "../models/CreateDirectoryDTO";
import Request from "../core/Request";
import type { FileDTO } from "../models/FileDTO";
import { Alert, Snackbar } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

const FileQuickActions: React.FC<{
  accessToken: string;
  currentParentId: string | null;
  setFiles: any;
}> = ({ accessToken, currentParentId, setFiles }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [openCreateFolderDialog, setOpenCreateFolderDialog] =
    React.useState<boolean>(false);
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);

  const handleFilesChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log(files);
  };

  const createDirectory = async (name: string) => {
    setOpenCreateFolderDialog(false);

    const createDirectoryData: CreateDirectoryDTO = {
      parentId: currentParentId,
      name,
    };

    const response = await Request.post(
      "/files/directories",
      accessToken,
      createDirectoryData
    );
    if (response.status === 201) {
      const createdFile: FileDTO = await response.json();
      setFiles((prevFiles: FileDTO[]) =>
        [...prevFiles, createdFile].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      setShowSnackbar(true);
    }
  };

  return (
    <React.Fragment>
      <UploadSpeedDial
        actions={[
          {
            icon: <UploadIcon />,
            name: "Upload files",
            onClick: () => {
              fileInputRef.current?.click();
            },
          },
          {
            icon: <CreateNewFolderIcon />,
            name: "New Folder",
            onClick: () => {
              setOpenCreateFolderDialog(true);
            },
          },
        ]}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFilesChanged}
        style={{ display: "none" }}
        multiple
      />
      <CreateFolderDialog
        open={openCreateFolderDialog}
        handleClose={() => setOpenCreateFolderDialog(false)}
        handleSubmit={createDirectory}
      />
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

export default FileQuickActions;
