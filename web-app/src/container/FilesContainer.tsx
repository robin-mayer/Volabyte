import React from "react";
import FileQuickActions from "../components/FileQuickActions";
import FileTable from "../components/FileTable";
import { Alert, Box, Snackbar } from "@mui/material";
import type { Breadcrumb } from "../types/Breadcrumb";
import FileBreadcrumbs from "../components/FileBreadcrumbs";
import type { FileDTO } from "../models/FileDTO";
import Request from "../core/Request";

const FilesContainer: React.FC<{ accessToken: string }> = ({ accessToken }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumb[]>([]);
  const [parentId, setParentId] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<FileDTO[]>([]);
  const [showSnackBar, setShowSnackbar] = React.useState<boolean>(false);

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
      setShowSnackbar(true);
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
        />
        <FileBreadcrumbs
          breadcrumbs={breadcrumbs}
          setBreadcrumbs={setBreadcrumbs}
        />
        <FileTable files={files} setBreadcrumbs={setBreadcrumbs} />
      </Box>
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

export default FilesContainer;
