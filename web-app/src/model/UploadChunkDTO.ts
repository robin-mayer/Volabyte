export interface UploadChunkDTO {
  parentId: string | null;
  fileId: string | null;
  isLastChunk: boolean;
  hash: string | null;
}
