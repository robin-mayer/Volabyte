import type { FileDTO } from "./FileDTO";

export interface UploadedChunkDTO {
  uploadId: string | null;
  uploadedFile: FileDTO | null;
}
