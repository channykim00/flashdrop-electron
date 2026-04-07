declare module "*.png" {
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

interface Window {
  api: {
    getLinkList: () => Promise<LinkItem[]>;
    updateLinkData: (linkData: LinkItem) => Promise<void>;
    selectFolder: () => Promise<string | null>;
    getDownloadHistory: () => Promise<FileHistoryItem[]>;
    deleteDownloadHistory: (fileId: string) => Promise<void>;
    searchLinksByTitle: (query: string) => Promise<SearchLinkResult[]>;
    searchDownloadHistory: (query: string) => Promise<FileHistoryItem[]>;
    searchBySender: (query: string) => Promise<FileHistoryItem[]>;
    openFolder: (path: string) => void;
    setUploadRequests?: (requests: UploadRequest[]) => void;
    getUploadRequests?: () => Promise<UploadRequest[]>;
    getDeviceId: () => Promise<string>;
    onShowUploadAccept: (callback: () => void) => void;
    offShowUploadAccept?: (callback: () => void) => void;
    onAutoAcceptUpload: (callback: (event: unknown, data: AutoUploadData) => void) => void;
    offAutoAcceptUpload?: (callback: (event: unknown, data: AutoUploadData) => void) => void;
    deleteLinkData: (uniqueUrl: string) => Promise<void>;
    getLinkByUniqueUrl: (uniqueUrl: string) => Promise<LinkItem | null>;
  };
}

interface SearchLinkResult {
  uniqueUrl: string;
  title: string;
}

interface UploadRequest {
  fileId: string;
  fileName: string;
}

export {};
