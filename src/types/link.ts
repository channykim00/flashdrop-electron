export interface BaseLinkData {
  id: string;
  title: string;
  folderPath: string;
  expireTime: number;
  password?: string | null;
  maxFileSize: number;
  autoAccept: boolean;
  requireSenderName: boolean;
  allowedFileTypeGroup: string;
}

export interface LinkItem extends BaseLinkData {
  uniqueUrl: string;
  createdAt: string;
}

export type LinkData = Partial<BaseLinkData> & Pick<BaseLinkData, "id">;
