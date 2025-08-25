import React from "react";
import UploadSpeedDial from "../components/UploadSpeedDial";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CreateFolderDialog from "../components/CreateFolderDialog";
import type { CreateDirectoryDTO } from "../models/CreateDirectoryDTO";
import Request from "../core/Request";
import type { FileDTO } from "../models/FileDTO";
import { Alert, Snackbar } from "@mui/material";

const FileQuickActions: React.FC<{ accessToken: string }> = ({
  accessToken,
}) => {
  const [openCreateFolderDialog, setOpenCreateFolderDialog] =
    React.useState<boolean>(false);
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);

  const createDirectory = async (name: string) => {
    setOpenCreateFolderDialog(false);

    const createDirectoryData: CreateDirectoryDTO = {
      parentId: null, // adjust ones a file browser is implemented
      name,
    };

    const response = await Request.post(
      "/files/directories",
      accessToken,
      createDirectoryData
    );
    if (response.status === 201) {
      const createdFile: FileDTO = await response.json();
      console.log("Created directory:", createdFile); // add to file explorer list once that exists
    } else {
      setShowSnackbar(true);
    }
  };

  return (
    <React.Fragment>
      <UploadSpeedDial
        actions={[
          {
            icon: <CreateNewFolderIcon />,
            name: "New Folder",
            onClick: () => {
              setOpenCreateFolderDialog(true);
            },
          },
        ]}
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
