import { contextBridge } from "electron";
import { ipcRenderer } from "electron/renderer";
import { decodePacket } from "engine.io-parser";
import CHANNELS from "../constants/CHANNELS";

const api = {
    "decodePacket": (encodedData: string) => {
        return decodePacket(encodedData);
    },
    "getAppInfo": () => {
        return ipcRenderer.invoke(CHANNELS.GET_APP_INFO);
    },
};

if (process.contextIsolated){
    try {
        contextBridge.exposeInMainWorld("api", api);
    } catch (error){
        console.error(error)
    }
}
