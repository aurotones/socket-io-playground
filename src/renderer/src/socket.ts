import io, { Socket } from "socket.io-client";
import { sanitizeUrl } from "@braintree/sanitize-url";
import socketActions from "./actions/socketActions";
import { InstanceStatus } from "./interfaces/InstanceInterface";
import formatUrl from "./utils/formatUrl";
import { store } from "./store";

interface SocketWrapper {
    id: string,
    io: Socket,
}

export default class socket {
    static instances: SocketWrapper[] = [];

    public static connect(id: string, uri: string, opts: any){
        const instanceIndex = socket.instances.push({
            id,
            io: io(sanitizeUrl(formatUrl(uri)), opts),
        });
        socket.instances[instanceIndex - 1].io.on("connect",() => {
            socket.instances[instanceIndex - 1].io.sendBuffer = [];
            socket.onConnect(id);
            const engine = socket.instances[instanceIndex - 1].io.io.engine;
            engine.on("packet",({ data }) => {
                socket.decodeData(id, data);
            });
        });
        socket.instances[instanceIndex - 1].io.on(
            "disconnect",
            () => socket.onDisconnect(id),
        );
        socket.instances[instanceIndex - 1].io.on(
            "connect_error",
            (err) => socket.onConnectionError(id, err),
        );
        store.dispatch(socketActions.setInstanceStatus(id, InstanceStatus.CONNECTING));
    }

    private static decodeData(id: string, data: any){
        if (data){
            console.log("Packet received from server!", data);
            const decoded = window.api.decodePacket(data);
            console.log("Packet decoded:", decoded);
            switch (decoded.type){
                case "ping":
                case "message":
                    store.dispatch(socketActions.onMsgReceive(id, decoded));
                    break;
                case "upgrade":
                    if (typeof decoded.data === "string" && decoded.data.includes("1-")){
                        store.dispatch(
                            socketActions.onMsgReceive(
                                id,
                                {
                                    ...decoded,
                                    data: decoded.data.replace("1-",""),
                                },
                            ),
                        );
                    } else {
                        socket.decodeData(id, decoded.data);
                    }
                    break;
            }
        }
    }

    private static getInstance(id: string): SocketWrapper {
        return socket.instances.find((instance) => {
            return instance && instance.id === id;
        });
    }

    public static disconnect(
        id: string,
        status: InstanceStatus,
        reason?: string,
    ){
        const instance = socket.getInstance(id);
        instance.io.disconnect();
        socket.instances = socket.instances.filter((instance) => {
            return instance.id !== id;
        });
        store.dispatch(socketActions.setInstanceStatus(id, status, reason));
    }

    private static onConnect(id: string){
        console.log("Socket connect!");
        store.dispatch(socketActions.setInstanceStatus(id, InstanceStatus.CONNECTED));
    }

    private static onDisconnect(id: string, reason?: string){
        console.log("Socket disconnect!");
        socket.disconnect(id, InstanceStatus.IDLE, reason);
        const instance = store.getState().main.instances.find((instance) => {
            return instance.id === id;
        });
        if (instance && !instance.options.preserveMessages){
            store.dispatch(socketActions.clearMessages(instance.id));
        }
    }

    private static onConnectionError(id: string, error: Error){
        console.log("Socket connection error!");
        console.error(error.message);
        socket.disconnect(id, InstanceStatus.ERROR, error.message);
    }

    public static emitToServer(id: string, type: string, message: string | object){
        const instance = socket.getInstance(id);
        instance.io.volatile.emit(type, message);
    }
}
