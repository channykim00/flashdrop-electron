import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import { io } from "socket.io-client";

import { API_URL, DEV_SERVER_URL } from "../config/constants.js";
import downloadStore from "../utils/downloadStore.js";
import { isDev } from "../utils/isDev.js";
import linkStore from "../utils/linkStore.js";
import startFileSync from "../utils/startFileSync.js";
import uploadRequestStore from "../utils/uploadRequestStore.js";

import { getOrCreateDeviceId } from "./deviceId.js";
import { handleChunkReceive } from "./handlers/fileReceiver.js";
import { createAppMenu } from "./menu.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 550,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  createAppMenu();

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
  ipcMain.on("accept-upload", (event, { uploadData }) => {
    socket.emit("accept-upload", { uploadData });
  });

  ipcMain.handle("get-upload-requests", () => {
    return uploadRequestStore.get("uploadRequests") || [];
  });
  ipcMain.handle("set-upload-requests", (event, requests) => {
    uploadRequestStore.set("uploadRequests", requests);
  });

  if (isDev()) {
    mainWindow.loadURL(DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist/index.html"));
  }

  mainWindow.webContents.on("did-finish-load", () => {
    const deviceId = getOrCreateDeviceId();
    socket.emit("register-device", deviceId);

    startFileSync(socket, mainWindow);
  });

  ipcMain.handle("select-folder", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    if (result.canceled) return null;
    return result.filePaths[0];
  });

  ipcMain.handle("get-device-id", () => {
    return getOrCreateDeviceId();
  });
  ipcMain.handle("save-link-data", async (event, linkData) => {
    try {
      const existingLinks = linkStore.get("list") || [];
      existingLinks.push(linkData);
      linkStore.set("list", existingLinks);
      return { success: true };
    } catch (err) {
      console.error("링크 저장 실패:", err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("update-link-data", async (event, linkData) => {
    try {
      const existingLinks = linkStore.get("list") || [];
      const hasMatch = existingLinks.some((link) => link.uniqueUrl === linkData.uniqueUrl);

      if (!hasMatch) {
        throw new Error("해당 링크가 존재하지 않습니다.");
      }

      const updatedLinks = existingLinks.map((link) =>
        link.uniqueUrl === linkData.uniqueUrl ? linkData : link,
      );

      linkStore.set("list", updatedLinks);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("delete-link-data", async (event, uniqueUrl) => {
    try {
      const existingLinks = linkStore.get("list") || [];
      const updatedLinks = existingLinks.filter((link) => link.uniqueUrl !== uniqueUrl);

      if (updatedLinks.length === existingLinks.length) {
        throw new Error("해당 링크가 존재하지 않습니다.");
      }

      linkStore.set("list", updatedLinks);
      return { success: true };
    } catch (err) {
      console.error("링크 삭제 실패:", err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("get-link-list", () => {
    return linkStore.get("list") || [];
  });

  ipcMain.handle("delete-link-by-url", (event, uniqueUrl) => {
    const all = linkStore.get("list") || [];
    const updated = all.filter((link) => link.uniqueUrl !== uniqueUrl);
    linkStore.set("list", updated);
    return { success: true };
  });

  ipcMain.handle("get-link-by-url", (event, uniqueUrl) => {
    const all = linkStore.get("list") || [];
    return all.find((link) => link.uniqueUrl === uniqueUrl) || null;
  });

  ipcMain.handle("search-links-by-title", (event, query) => {
    const all = linkStore.get("list") || [];
    const keywords = query.trim().toLowerCase().split(/\s+/);

    return all.filter((link) => {
      const title = link.title?.toLowerCase() || "";
      return keywords.every((kw) => title.includes(kw));
    });
  });

  ipcMain.handle("search-by-filename", (event, query) => {
    const all = downloadStore.get("downloadedFiles") || [];
    const lowerQuery = query.toLowerCase();

    return all.filter((file) => file.originalFilename?.toLowerCase().includes(lowerQuery));
  });

  ipcMain.handle("search-by-sender", (event, query) => {
    const all = downloadStore.get("downloadedFiles") || [];
    const lowerQuery = query.toLowerCase();

    return all.filter((file) => file.senderName?.toLowerCase().includes(lowerQuery));
  });

  ipcMain.handle("open-folder", async (event, folderPath) => {
    try {
      const result = await shell.openPath(folderPath);
      if (result) throw new Error(result);
      return { success: true };
    } catch (err) {
      console.error("폴더 열기 실패:", err);
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle("save-file", async (event, { fileName, fileData, folderPath }) => {
    try {
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const filePath = path.join(folderPath, fileName);
      const buffer = Buffer.from(fileData);

      await fs.promises.writeFile(filePath, buffer);

      return { success: true };
    } catch (err) {
      console.error("파일 저장 실패:", err);
      throw err;
    }
  });

  ipcMain.handle("get-download-history", () => {
    const history = downloadStore.get("downloadedFiles") || [];
    return history;
  });
  ipcMain.handle("delete-download-history", (event, fileId) => {
    const files = downloadStore.get("downloadedFiles") || [];

    const updated = files.filter((f) => f.fileId !== fileId);
    downloadStore.set("downloadedFiles", updated);

    return true;
  });
});
