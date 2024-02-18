import { join } from "path";
import { app, shell, screen, BrowserWindow } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import icon from "../../build/icon.png?asset";

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
            sandbox: false,
            contextIsolation: true,
        },
    }
    switch (process.platform){
        case "darwin":
            options = {
                ...options,
                webPreferences: {
                    preload: join(__dirname, "../preload/index.js"),
                    sandbox: true,
                },
            }
            break;
        case "linux":
            options = {
                ...options,
                icon: icon,
                webPreferences: {
                    preload: join(__dirname, "../preload/index.js"),
                    sandbox: false,
                    contextIsolation: true,
                },
            }
            break;
        case "win32":
            options = {
                ...options,
                webPreferences: {
                    preload: join(__dirname, "../preload/index.js"),
                    sandbox: false,
                    contextIsolation: true,
                },
            }
    }

    const mainWindow = new BrowserWindow(options);

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
