import type { FileDTO } from "./FileDTO";

export interface UploadedChunkDTO {
  fileId: string | null;
  uploadedFile: FileDTO | null;
}
