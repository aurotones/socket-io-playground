import { contextBridge } from "electron";
import { decodePacket } from "engine.io-parser";

const api = {
    "decodePacket": (encodedData: string) => {
        return decodePacket(encodedData);
    },
};

if (process.contextIsolated){
    try {
        contextBridge.exposeInMainWorld("api", api);
    } catch (error){
        console.error(error)
    }
}
