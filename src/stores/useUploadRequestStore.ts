import { create } from "zustand";

import type { UploadRequest } from "@/global";

interface UploadRequestStore {
  requests: UploadRequest[];
  addRequest: (_request: UploadRequest) => void;
  removeRequest: (_fileId: string) => void;
  getLocalRequests: () => Promise<void>;
}

const useUploadRequestStore = create<UploadRequestStore>((set, get) => ({
  requests: [],

  addRequest: (request) => {
    const updatedRequests = [...get().requests, request];
    set({ requests: updatedRequests });
    window.api.setUploadRequests!(updatedRequests);
  },

  removeRequest: (fileId) => {
    const updatedRequests = get().requests.filter((r) => r.fileId !== fileId);
    set({ requests: updatedRequests });
    window.api.setUploadRequests!(updatedRequests);
  },

  getLocalRequests: async () => {
    const storedRequests = await window.api.getUploadRequests!();
    if (Array.isArray(storedRequests)) {
      set({ requests: storedRequests });
    }
  },
}));

export default useUploadRequestStore;
