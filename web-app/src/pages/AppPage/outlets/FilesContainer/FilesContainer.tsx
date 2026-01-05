import React from "react";
import FileQuickActions from "./components/FileQuickActions";
import { Box } from "@mui/material";
import type { Breadcrumb } from "../../../../types/Breadcrumb";
import FileBreadcrumbs from "./components/FileBreadcrumbs";
import type { FileDTO } from "../../../../models/FileDTO";
import Request from "../../../../core/Request";
import FileTable from "./components/FileTable";

const FilesContainer: React.FC<{
  accessToken: string;
  setSnackbarProps: any;
}> = ({ accessToken, setSnackbarProps }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([]);
  const [parentId, setParentId] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<FileDTO[]>([]);

  React.useEffect(() => {
    const newParentId =
      breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].id : null;
    if (newParentId !== parentId) {
      setParentId(newParentId);
    }
  }, [breadcrumbs]);

  React.useEffect(() => {
    fetchFiles();
  }, [parentId]);

  const fetchFiles = async () => {
    const requestPath = parentId ? `/files/${parentId}/list` : `/files/list`;
    const response = await Request.get(requestPath, accessToken);
    if (response.status === 200) {
      const data: FileDTO[] = await response.json();
      setFiles(data);
    } else {
      setSnackbarProps({
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: "1rem",
        }}
      >
        <FileQuickActions
          accessToken={accessToken}
          currentParentId={parentId}
          setFiles={setFiles}
          setSnackbarProps={setSnackbarProps}
        />
        <FileBreadcrumbs
          breadcrumbs={breadcrumbs}
          setBreadcrumbs={setBreadcrumbs}
        />
        <FileTable files={files} setBreadcrumbs={setBreadcrumbs} />
      </Box>
    </React.Fragment>
  );
};

export default FilesContainer;
