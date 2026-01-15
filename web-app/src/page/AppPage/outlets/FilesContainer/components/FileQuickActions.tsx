import React from "react";
import UploadSpeedDial from "./UploadSpeedDial";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import CreateFolderDialog from "./CreateFolderDialog";
import type { CreateDirectoryDTO } from "../../../../../model/CreateDirectoryDTO";
import Request from "../../../../../service/RequestService";
import type { FileDTO } from "../../../../../model/FileDTO";
import UploadIcon from "@mui/icons-material/Upload";
import type { UploadedChunkDTO } from "../../../../../model/UploadedChunkDTO";
import { useSnackbar } from "../../../../../provider/Snackbar";
import { useAuthenticatedUser } from "../../../../../provider/AuthenticatedUser";

const FileQuickActions: React.FC<{
  currentParentId: string | null;
  setFiles: any;
}> = ({ currentParentId, setFiles }) => {
  const snackbar = useSnackbar();
  const authenticatedUser = useAuthenticatedUser();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [openCreateFolderDialog, setOpenCreateFolderDialog] =
    React.useState<boolean>(false);

  const handleFilesChanged = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    const CHUNK_SIZE = 1024 * 1024;
    Array.from(files).forEach(async (file) => {
      let offset = 0;
      let fileId: string | null = null;

      while (offset < file.size) {
        const isLastChunk = offset + CHUNK_SIZE >= file.size;
        const chunk = file.slice(offset, offset + CHUNK_SIZE);

        const response = await Request.uploadFileChunk(
          authenticatedUser.getAuthenticatedUser()?.accessToken!!,
          file.name,
          chunk as File,
          currentParentId,
          fileId,
          isLastChunk
        );

        if (!response.ok) {
          throw new Error("Chunk upload failed");
        }

        const result: UploadedChunkDTO = await response.json();
        fileId = result.fileId;
        if (result.uploadedFile) {
          setFiles((prevFiles: FileDTO[]) =>
            [...prevFiles, result.uploadedFile!].sort((a, b) =>
              a.name.localeCompare(b.name)
            )
          );
        }

        offset += CHUNK_SIZE;
      }
    });
  };

  const createDirectory = async (name: string) => {
    setOpenCreateFolderDialog(false);

    const createDirectoryData: CreateDirectoryDTO = {
      parentId: currentParentId,
      name,
    };

    const response = await Request.post(
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
