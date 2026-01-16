export interface FileDTO {
  id: string;
  name: string;
  isDirectory: boolean;
  referencedFile: string | null;
  parentId: string | null;
  ownerId: string;
  uploadedAt: Date;
}
