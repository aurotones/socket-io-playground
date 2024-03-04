import { join } from "path";
import { app, shell, screen, session, BrowserWindow, Menu } from "electron";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import BrowserWindowConstructorOptions = Electron.BrowserWindowConstructorOptions;
import contextMenu from "electron-context-menu";
import icon from "../../build/icon.png?asset";

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

// ipcMain.on("show-context-menu",(event) => {
//     const template: MenuItem[] = [
//         {
//             label: 'Menu Item 1',
//             click: () => {
//                 event.sender.send('context-menu-command', 'menu-item-1')
//             }
//         },
//         { type: 'separator' },
//         { label: 'Menu Item 2', type: 'checkbox', checked: true }
//     ]
//     const menu = Menu.buildFromTemplate(template)
//     menu.popup({
//         window: BrowserWindow.fromWebContents(event.sender),
//     })
// })
