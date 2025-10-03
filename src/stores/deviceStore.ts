import { create } from "zustand";

interface DeviceStore {
  deviceId: string | null;
  setDeviceId: (id: string) => void;
}

const useDeviceStore = create<DeviceStore>((set) => ({
  deviceId: null,
  setDeviceId: (id: string) => set({ deviceId: id }),
}));

export default useDeviceStore;
