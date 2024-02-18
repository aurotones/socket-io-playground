import { join } from "path";
import { app, shell, screen, BrowserWindow } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

async function createWindow(): Promise<void> {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const mainWindow = new BrowserWindow({
        minWidth: 900,
        minHeight: 670,
        width: width,
        height: height,
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === "linux" ? {
            icon,
        } : {}),
        webPreferences: {
            preload: join(__dirname, "../preload/index.js"),
            sandbox: false
        }
    });

    mainWindow.on("ready-to-show",() => {
        mainWindow.show();
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url);
        return {
            action: "deny",
        }
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
        await mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
        await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
    }

    mainWindow.webContents.session.webRequest.onBeforeSendHeaders(
        (details, callback) => {
            callback({
                requestHeaders: {
                    Origin: "*",
                    ...details.requestHeaders,
                }
            });
        },
    );

    mainWindow.webContents.session.webRequest.onHeadersReceived(
        (details, callback) => {
            callback({
                responseHeaders: {
                    "Access-Control-Allow-Origin": ["*"],
                    ...details.responseHeaders,
                },
            });
        }
    );
}

if (process.platform === "linux"){
    app.commandLine.appendSwitch("--no-sandbox");
}

app.whenReady().then(async () => {
    electronApp.setAppUserModelId("com.electron");
    app.on("browser-window-created",(_, window) => {
        optimizer.watchWindowShortcuts(window);
    });
    await createWindow();
});

app.on("window-all-closed",() => {
    app.quit();
});
