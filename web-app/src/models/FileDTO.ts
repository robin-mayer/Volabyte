export interface FileDTO {
  id: number;
  name: string;
  isDirectory: boolean;
  referencedFile: string | null;
  parentId: number | null;
  ownerId: string;
  uploadedAt: Date;
}
