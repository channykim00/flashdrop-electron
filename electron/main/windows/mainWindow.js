import path from "path";
import { fileURLToPath } from "url";

import { BrowserWindow, app } from "electron";

import { DEV_SERVER_URL } from "../../config/constants.js";
import { isDev } from "../../utils/isDev.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createMainWindow() {
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

  if (isDev()) {
    mainWindow.loadURL(DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist/index.html"));
  }

  return mainWindow;
}
