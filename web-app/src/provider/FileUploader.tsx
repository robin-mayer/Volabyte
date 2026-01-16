import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import RequestService from "../service/RequestService";
import { useAuthenticatedUser } from "./AuthenticatedUser";
import type { UploadedChunkDTO } from "../model/UploadedChunkDTO";
import { ArrowDropUp } from "@mui/icons-material";
import SuccessAnimation from "../component/SuccessAnimation";

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
            setTimeout(() => {
              setFilesToUpload((prevFiles) =>
                prevFiles.filter((f) => f.id !== fileUpload.id)
              );
            }, 2500);
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
      {filesToUpload.length > 0 && (
        <Accordion
          sx={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "40rem",
            maxWidth: "400px",
          }}
          defaultExpanded={true}
        >
          <AccordionSummary expandIcon={<ArrowDropUp />}>
            <Typography variant="h6">Uploads</Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {filesToUpload.map((fileUpload, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "90%",
                  }}
                >
                  {fileUpload.file.name}
                </Typography>
                {fileUpload.status === "uploading" && (
                  <CircularProgress
                    size={24}
                    thickness={8}
                    variant="determinate"
                    value={
                      (fileUpload.uploadedBytes / fileUpload.totalBytes) * 100
                    }
                  />
                )}
                {fileUpload.status === "completed" && <SuccessAnimation />}
              </Box>
            ))}
          </AccordionDetails>
        </Accordion>
      )}
    </FileUploaderContext.Provider>
  );
};
