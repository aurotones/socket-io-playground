import io, { Socket } from "socket.io-client";

import { store } from "./store";
import socketActions from "./actions/socketActions";
import { InstanceStatus } from "./interfaces/InstanceInterface";

interface SocketWrapper {
    id: string,
    io: Socket,
}

export default class socket {
    static instances: SocketWrapper[] = [];

    public static connect(id: string, uri: string, opts: any){
        const instance = io(uri, {
            ...opts,
            retries: 1,
            forceNew: true,
        });
        instance.on("connect",() => {
            instance.sendBuffer = [];
            socket.onConnect(id);
            const engine = instance.io.engine;
            engine.on("packet",({ data }) => {
                console.log("Packet received from server!", data);
                if (data){
                    // @ts-ignore
                    const decoded = window.api.decodePacket(data);
                    store.dispatch(socketActions.onMsgReceive(id, decoded));
                }
            });
            engine.on("drain",() => {
                console.log("Write buffer is drained!");
            });
        });
        instance.on("disconnect",() => socket.onDisconnect(id));
        instance.on("connect_error",(err) => socket.onConnectionError(id, err));
        socket.instances.push({
            id,
            io: instance,
        });
        store.dispatch(socketActions.setInstanceStatus(id, InstanceStatus.CONNECTING));
    }

    private static getInstance(id: string): SocketWrapper["io"] {
        let _instance = null;
        socket.instances.forEach((instance) => {
            if (!_instance && instance.id === id){
                _instance = instance.io;
            }
        });
        return _instance;
    }

    public static disconnect(
        id: string,
        status: InstanceStatus,
        reason?: string,
    ){
        const instance = socket.getInstance(id);
        instance.disconnect();
        socket.instances = socket.instances.filter((instance) => {
            return instance.id !== id;
        });
        store.dispatch(socketActions.setInstanceStatus(id, status, reason));
        console.log(socket.instances);
    }

    // public static destroy(id: string){
    //     socket.disconnect(id);
    //     socket.instances = socket.instances.filter((instance) => {
    //         return instance.id === id;
    //     });
    // }

    private static onConnect(id: string){
        console.log("Socket connect!");
        store.dispatch(socketActions.setInstanceStatus(id, InstanceStatus.CONNECTED));
    }

    private static onDisconnect(id: string, reason?: string){
        console.log("Socket disconnect!");
        socket.disconnect(id, InstanceStatus.IDLE, reason);
    }

    private static onConnectionError(id: string, error: Error){
        console.log("Socket connection error!");
        console.error(error.message);
        socket.disconnect(id, InstanceStatus.ERROR, error.message);
    }

    public static emitToServer(id: string, type: string, message: string | object){
        console.log(socket.instances);
        const instance = socket.getInstance(id);
        instance.volatile.emit(type, message);
    }
}
