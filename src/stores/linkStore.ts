import { create } from "zustand";

interface LinkSettings {
  title: string;
  expireTime: string;
  allowedFileTypeGroup: string;
  maxFileSize: number;
  autoAccept: boolean;
}

interface SecuritySettings {
  requireSenderName: boolean;
  password: string;
}

interface LinkStore {
  folderPath: string | null;
  linkSettings: LinkSettings;
  securitySettings: SecuritySettings;
  setFolderPath: (_path: string | null) => void;
  setLinkSettings: (_settings: Partial<LinkSettings>) => void;
  setSecuritySettings: (_settings: Partial<SecuritySettings>) => void;
  setAll: (_data: {
    folderPath: string | null;
    linkSettings: LinkSettings;
    securitySettings: SecuritySettings;
  }) => void;
  reset: () => void;
}

const defaultLinkSettings = {
  title: "Untitled",
  expireTime: "60",
  allowedFileTypeGroup: "all",
  maxFileSize: 2 * 1024 * 1024 * 1024,
  autoAccept: false,
};

const defaultSecuritySettings = {
  requireSenderName: false,
  password: "",
};

const useLinkStore = create<LinkStore>((set) => ({
  folderPath: null,
  linkSettings: { ...defaultLinkSettings },
  securitySettings: { ...defaultSecuritySettings },

  setFolderPath: (path: string | null) => set({ folderPath: path }),

  setLinkSettings: (settings: Partial<LinkSettings>) =>
    set((state) => ({
      linkSettings: { ...state.linkSettings, ...settings },
    })),

  setSecuritySettings: (settings: Partial<SecuritySettings>) =>
    set((state) => ({
      securitySettings: { ...state.securitySettings, ...settings },
    })),

  setAll: ({
    folderPath,
    linkSettings,
    securitySettings,
  }: {
    folderPath: string | null;
    linkSettings: LinkSettings;
    securitySettings: SecuritySettings;
  }) =>
    set({
      folderPath,
      linkSettings: { ...linkSettings },
      securitySettings: { ...securitySettings },
    }),

  reset: () =>
    set({
      folderPath: null,
      linkSettings: { ...defaultLinkSettings },
      securitySettings: { ...defaultSecuritySettings },
    }),
}));

export default useLinkStore;
