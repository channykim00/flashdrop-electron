declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

interface LinkItem {
  id: string;
  title: string;
  folderPath: string;
  uniqueUrl: string;
  expireTime: number;
  password?: string | null;
  maxFileSize: number;
  autoAccept: boolean;
  requireSenderName: boolean;
  allowedFileTypeGroup: string;
  createdAt: string;
}

interface FileHistoryItem {
  fileId: string;
  originalFilename: string;
  size: number;
  savedDirectory: string;
  downloadTime: number;
  senderName?: string;
}

interface AutoUploadData {
  filename: string;
}

declare global {
  interface Window {
    api: {
      getLinkList: () => Promise<LinkItem[]>;
      updateLinkData: (_linkData: LinkItem) => Promise<void>;
      selectFolder: () => Promise<string | null>;
      getDownloadHistory: () => Promise<FileHistoryItem[]>;
      deleteDownloadHistory: (_fileId: string) => Promise<void>;
      searchLinksByTitle: (_query: string) => Promise<SearchLinkResult[]>;
      searchDownloadHistory: (_query: string) => Promise<FileHistoryItem[]>;
      searchBySender: (_query: string) => Promise<FileHistoryItem[]>;
      openFolder: (_path: string) => void;
      setUploadRequests?: (_requests: UploadRequest[]) => void;
      getUploadRequests?: () => Promise<UploadRequest[]>;
      getDeviceId: () => Promise<string>;
      onShowUploadAccept: (_callback: () => void) => void;
      offShowUploadAccept?: (_callback: () => void) => void;
      onAutoAcceptUpload: (_callback: (_event: unknown, _data: AutoUploadData) => void) => void;
      offAutoAcceptUpload?: (_callback: (_event: unknown, _data: AutoUploadData) => void) => void;
      deleteLinkData: (_uniqueUrl: string) => Promise<void>;
      getLinkByUniqueUrl: (_uniqueUrl: string) => Promise<LinkItem | null>;
      saveLinkData: (_linkData: LinkItem) => Promise<{ success: boolean; error?: string }>;
      sendAcceptedUpload: (_uploadData: UploadRequest) => void;
    };
  }
}

interface SearchLinkResult {
  uniqueUrl: string;
  title: string;
}

interface UploadRequest {
  fileId: string;
  fileName: string;
  senderName?: string;
  size: number;
  title: string;
  startedAt: number;
}

// Export types for use in other files
export type { LinkItem, FileHistoryItem, AutoUploadData, SearchLinkResult, UploadRequest };
