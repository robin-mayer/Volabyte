import React from "react";
import FileQuickActions from "./components/FileQuickActions";
import { Box } from "@mui/material";
import type { Breadcrumb } from "../../../../types/Breadcrumb";
import FileBreadcrumbs from "./components/FileBreadcrumbs";
import type { FileDTO } from "../../../../models/FileDTO";
import Request from "../../../../service/RequestService";
import FileTable from "./components/FileTable";
import { useSnackbar } from "../../../../provider/Snackbar";
import { useAuthenticatedUser } from "../../../../provider/AuthenticatedUser";

const FilesContainer = () => {
  const snackbar = useSnackbar();
  const authenticatedUser = useAuthenticatedUser();

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
    const response = await Request.get(
      requestPath,
      authenticatedUser.getAuthenticatedUser()?.accessToken!!
    );
    if (response.status === 200) {
      const data: FileDTO[] = await response.json();
      setFiles(data);
    } else {
      snackbar.show("Something went wrong. Please try again.", "error");
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
        <FileQuickActions currentParentId={parentId} setFiles={setFiles} />
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
