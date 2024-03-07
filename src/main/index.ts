import * as os from "os";
import { join } from "path";
import { app, shell, screen, session, ipcMain, BrowserWindow } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import contextMenu from "electron-context-menu";
import { autoUpdater } from "electron-updater";
import icon from "../../build/icon.png?asset";
import CHANNELS from "../constants/CHANNELS";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;

const cspRules = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "app:"],
    "style-src": [
        "'unsafe-inline'",
        "'self'",
    ],
    "img-src": ["'self'"],
    "font-src": ["'self'"],
    "connect-src": ["*"],
    "object-src": ["'none'"],
    "frame-src": ["'none'"],
};

let mainWindow: BrowserWindow | null = null;
autoUpdater.autoDownload = false;

async function createWindow(): Promise<void> {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    let options: BrowserWindowConstructorOptions = {
        minWidth: 900,
        minHeight: 670,
        width: width,
        height: height,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: true,
            contextIsolation: true,
            webSecurity: true,
            nodeIntegration: false,
            allowRunningInsecureContent: false,
        },
    }

    switch (process.platform){
        case "linux":
            options = {
                ...options,
                icon: icon,
            }
            break;
    }

    mainWindow = new BrowserWindow(options);

    mainWindow.on("ready-to-show",async () => {
        mainWindow?.show();
        await autoUpdater.checkForUpdatesAndNotify();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return {
            action: "deny",
        }
    });

    session.defaultSession.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            details.requestHeaders["User-Agent"] = `SocketIO-Playground ${app.getVersion()}`;
            callback({
                requestHeaders: details.requestHeaders,
            });
        },
    );

    session.defaultSession.webRequest.onHeadersReceived(
        (details, callback) => {
            if (is.dev){
                callback({
                    responseHeaders: {
                        ...details.responseHeaders,
                        "Access-Control-Allow-Origin": ["*"],
                    },
                });
            } else {
                callback({
                    responseHeaders: {
                        ...details.responseHeaders,
                        "Content-Security-Policy": [
                            Object.entries(cspRules).map(([key, value]) => {
                                return `${key} ${value.join(" ")}`;
                            }).join(";"),
                        ],
                    },
                });
            }
        }
    );

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]){
        await mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }

    contextMenu();
}

app.whenReady().then(async () => {
    electronApp.setAppUserModelId("com.aurotones.socket-io-playground");
    app.on("browser-window-created",(_, window) => {
        optimizer.watchWindowShortcuts(window);
    });
    await createWindow();
});

app.on("window-all-closed",() => {
    app.quit();
});

app.on("web-contents-created",(_e, contents) => {
    contents.on("will-navigate",(event) => {
        event.preventDefault();
    });
});

autoUpdater.on("checking-for-update",() => {
    console.log("Checking for update...");
})
autoUpdater.on("update-available",() => {
    console.log("Update available.");
})
autoUpdater.on("update-not-available",() => {
    console.log("Update not available.");
})
autoUpdater.on("error",(err) => {
    console.log("Error in auto-updater. " + err);
})
autoUpdater.on("download-progress",(progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + " - Downloaded " + progressObj.percent + "%";
    log_message = log_message + " (" + progressObj.transferred + "/" + progressObj.total + ")";
    console.log(log_message);
})
autoUpdater.on("update-downloaded",() => {
    console.log("Update downloaded");
});

ipcMain.handle(CHANNELS.GET_APP_INFO,() => {
    return {
        version: app.getVersion(),
        arch: os.arch(),
        platform: process.platform,
    }
});
