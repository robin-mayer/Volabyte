import React from "react";
import FileQuickActions from "./component/FileQuickActions";
import { Box } from "@mui/material";
import FileBreadcrumbs from "./component/FileBreadcrumbs";
import FileTable from "./component/FileTable";
import type { Breadcrumb } from "../../model/Breadcrumb";
import type { FileDTO } from "../../model/FileDTO";
import { useAuthenticatedUser } from "../../provider/AuthenticatedUser";
import { useSnackbar } from "../../provider/Snackbar";
import RequestService from "../../service/RequestService";

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
    const response = await RequestService.get(
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
