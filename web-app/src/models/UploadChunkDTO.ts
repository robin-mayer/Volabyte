export interface UploadChunkDTO {
  fileName: string;
  parentId: string | null;
  uploadId: string | null;
  lastChunk: boolean;
}
