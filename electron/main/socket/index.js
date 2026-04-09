import { io } from "socket.io-client";

import { API_URL } from "../../config/constants.js";
import uploadRequestStore from "../../utils/uploadRequestStore.js";
import { handleChunkReceive } from "../handlers/fileReceiver.js";

export const setupSocket = (mainWindow) => {
  const socket = io(API_URL);

  socket.on("connect_error", (err) => {
    console.error("소켓 연결 오류:", err.message);
  });

  socket.on("receive-chunk", (data) => {
    handleChunkReceive(data, socket);
  });

  socket.on("request-upload-accept", async (data) => {
    if (data.autoAccept === true) {
      mainWindow.webContents.send("auto-accept-upload", data);
      socket.emit("accept-upload", { uploadData: data });
      return;
    }
    const requests = uploadRequestStore.get("uploadRequests") || [];
    requests.push(data);
    uploadRequestStore.set("uploadRequests", requests);

    mainWindow.webContents.send("show-upload-accept", data);
  });

  return socket;
};
