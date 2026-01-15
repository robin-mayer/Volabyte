import { Box, Paper, Typography } from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import RequestService from "../service/RequestService";
import { useAuthenticatedUser } from "./AuthenticatedUser";
import type { UploadedChunkDTO } from "../model/UploadedChunkDTO";

type FileUploaderAPI = {
  scheduleFile: (file: File, parentId: string | null) => void;
};

const FileUploaderContext = createContext<FileUploaderAPI | null>(null);

export const useFileUploader = () => {
  const context = useContext(FileUploaderContext);
  if (!context) {
    throw new Error(
      "useFileUploader must be used within a FileUploaderProvider"
    );
  }
  return context;
};

interface FileToUpload {
  id: string;
  file: File;
  parentId: string | null;
  uploadedBytes: number;
  totalBytes: number;
  status: "scheduled" | "uploading" | "completed" | "error";
}

export const FileUploaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const CHUNK_SIZE = 1024 * 1024;
  const authenticatedUser = useAuthenticatedUser();
  const [filesToUpload, setFilesToUpload] = useState<FileToUpload[]>([]);
  const isUploadingRef = useRef(false);

  const api = {
    scheduleFile: (file: File, parentId: string | null) => {
      setFilesToUpload((prevFiles) => [
        ...prevFiles,
        {
          id: crypto.randomUUID(),
          file,
          parentId,
          uploadedBytes: 0,
          totalBytes: file.size,
          status: "scheduled",
        },
      ]);
    },
  };

  useEffect(() => {
    if (filesToUpload.length === 0) return;
    processUploadQueue();
  }, [filesToUpload]);

  const processUploadQueue = async () => {
    if (isUploadingRef.current) return;
    isUploadingRef.current = true;

    try {
      for (const fileUpload of filesToUpload) {
        if (fileUpload.status !== "scheduled") continue;
        setFilesToUpload((prevFiles) =>
          prevFiles.map((f) =>
            f.id === fileUpload.id ? { ...f, status: "uploading" } : f
          )
        );

        let offset = 0;
        let fileId: string | null = null;

        while (offset < fileUpload.file.size) {
          console.log("Uploading chunk:", {
            fileName: fileUpload.file.name,
            offset,
            chunkSize: Math.min(CHUNK_SIZE, fileUpload.file.size - offset),
          });
          const isLastChunk = offset + CHUNK_SIZE >= fileUpload.file.size;
          const chunk = fileUpload.file.slice(offset, offset + CHUNK_SIZE);

          const response = await RequestService.uploadFileChunk(
            authenticatedUser.getAuthenticatedUser()?.accessToken!!,
            fileUpload.file.name,
            chunk as File,
            fileUpload.parentId,
            fileId,
            isLastChunk
          );

          if (!response.ok) {
            setFilesToUpload((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileUpload.id ? { ...f, status: "error" } : f
              )
            );
          }

          const result: UploadedChunkDTO = await response.json();
          fileId = result.fileId;

          if (result.uploadedFile) {
            setFilesToUpload((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileUpload.id
                  ? { ...f, status: "completed", uploadedBytes: f.totalBytes }
                  : f
              )
            );
          } else {
            setFilesToUpload((prevFiles) =>
              prevFiles.map((f) =>
                f.id === fileUpload.id
                  ? { ...f, uploadedBytes: offset + chunk.size }
                  : f
              )
            );
          }

          offset += CHUNK_SIZE;
        }
      }
    } finally {
      isUploadingRef.current = false;
    }
  };

  return (
    <FileUploaderContext.Provider value={api}>
      {children}
      <Paper
        elevation={7}
        sx={{
          position: "fixed",
          bottom: "0",
          right: "2rem",
          width: "30%",
          maxWidth: "30rem",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottomLeftRadius: "0",
          borderBottomRightRadius: "0",
        }}
      >
        <Box
          sx={{
            backgroundColor: "rgb(25, 118, 210)",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            padding: "0.5rem 1rem",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Uploads
          </Typography>
          {filesToUpload.map((fileUpload, index) => (
            <Box key={index} sx={{ marginTop: "0.5rem" }}>
              <Typography variant="body2">
                {fileUpload.file.name} - {fileUpload.parentId ?? "root"} -{" "}
                {fileUpload.uploadedBytes}/{fileUpload.totalBytes} bytes -{" "}
                {fileUpload.status}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </FileUploaderContext.Provider>
  );
};
