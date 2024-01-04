import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { decodePacket } from "engine.io-parser";

const api = {
    decodePacket: (encodedData: string) => {
        return decodePacket(encodedData);
    },
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
    window.electron = electronAPI;
    // @ts-ignore (define in dts)
    window.api = api;
}
