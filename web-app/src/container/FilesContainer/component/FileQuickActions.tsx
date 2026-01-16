import React from "react";
import UploadSpeedDial from "./UploadSpeedDial";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CreateFolderDialog from "./CreateFolderDialog";
import UploadIcon from "@mui/icons-material/Upload";
import type { CreateDirectoryDTO } from "../../../model/CreateDirectoryDTO";
import type { FileDTO } from "../../../model/FileDTO";
import { useAuthenticatedUser } from "../../../provider/AuthenticatedUser";
import { useSnackbar } from "../../../provider/Snackbar";
import RequestService from "../../../service/RequestService";
import { useFileUploader } from "../../../provider/FileUploader";

const FileQuickActions: React.FC<{
  currentParentId: string | null;
  setFiles: any;
}> = ({ currentParentId, setFiles }) => {
  const snackbar = useSnackbar();
  const authenticatedUser = useAuthenticatedUser();
  const fileUploader = useFileUploader();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [openCreateFolderDialog, setOpenCreateFolderDialog] =
    React.useState<boolean>(false);

  const handleFilesChanged = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 0) {
        fileUploader.scheduleFile(file, currentParentId);
      }
    });
  };

  const createDirectory = async (name: string) => {
    setOpenCreateFolderDialog(false);

    const createDirectoryData: CreateDirectoryDTO = {
      parentId: currentParentId,
      name,
    };

    const response = await RequestService.post(
      "/files/directories",
      authenticatedUser.getAuthenticatedUser()?.accessToken!!,
      createDirectoryData
    );
    if (response.status === 201) {
      const createdFile: FileDTO = await response.json();
      setFiles((prevFiles: FileDTO[]) =>
        [...prevFiles, createdFile].sort((a, b) => a.name.localeCompare(b.name))
      );
    } else {
      snackbar.show("Something went wrong. Please try again.", "error");
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
    </React.Fragment>
  );
};

export default FileQuickActions;
