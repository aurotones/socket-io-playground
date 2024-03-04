import { ElectronAPI } from "@electron-toolkit/preload";
import { Packet } from "engine.io-parser/build/esm/commons";

declare global {
    interface Window {
        electron: ElectronAPI
        api: {
            decodePacket: (data: any) => Packet,
        }
    }
}
