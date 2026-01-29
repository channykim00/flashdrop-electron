import { API_URL } from "../config/constants.js";

import downloadStore from "./downloadStore.js";
import linkStore from "./linkStore.js";
import uploadStore from "./uploadRequestStore.js";

const startFileSync = async (socket, mainWindow) => {
  const localLinkList = linkStore.get("list") || [];
  const downloadedRecords = downloadStore.get("downloadedFiles") || [];
  const downloadedFileIds = downloadedRecords.map((d) => d.fileId);
  const uniqueUrls = localLinkList.map((link) => link.uniqueUrl);

  if (uniqueUrls.length === 0) return;

  const linkMap = new Map();
  for (const link of localLinkList) {
    linkMap.set(link.uniqueUrl, link);
  }

  try {
    const res = await fetch(`${API_URL}/api/uploaded-file/by-unique-urls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uniqueUrls }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    const serverFiles = data.files;

    const localFiles = uploadStore.get("uploadRequests") || [];
    const localFileIds = localFiles.map((file) => file.fileId);
    const newFiles = serverFiles.filter(
      (serverFile) =>
        !localFileIds.includes(serverFile.fileId) && !downloadedFileIds.includes(serverFile.fileId),
    );

    if (newFiles.length > 0) {
      const requestsToStore = [];

      for (const file of newFiles) {
        const linkInfo = linkMap.get(file.uniqueUrl);

        if (linkInfo?.autoAccept) {
          socket.emit("accept-upload", { uploadData: file });
          mainWindow.webContents.send("auto-accept-upload", file);
        } else {
          requestsToStore.push(file);
          mainWindow.webContents.send("show-upload-accept", file);
        }
      }

      if (requestsToStore.length > 0) {
        const updatedList = [...localFiles, ...requestsToStore];
        uploadStore.set("uploadRequests", updatedList);
      }
    }
  } catch (err) {
    console.error("파일 동기화 실패:", err);
  }
};

export default startFileSync;
