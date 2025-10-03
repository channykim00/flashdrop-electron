import { create } from "zustand";

interface UploadRequestStore {
  requests: UploadRequest[];
  addRequest: (request: UploadRequest) => void;
  removeRequest: (fileId: string) => void;
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
