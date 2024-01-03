import { Notification, contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {
    test: () => {
        const NOTIFICATION_TITLE = "Basic Notification";
        const NOTIFICATION_BODY = "Notification from the Main process";

        new Notification({
            title: NOTIFICATION_TITLE,
            body: NOTIFICATION_BODY
        }).show();
    }
};

if (process.contextIsolated){
    try {
        contextBridge.exposeInMainWorld("electron", electronAPI);
        contextBridge.exposeInMainWorld("api", api);
    } catch (error){
        console.error(error)
    }
} else {
    // @ts-ignore (define in dts)
    window.electron = electronAPI
    // @ts-ignore (define in dts)
    window.api = api
}
