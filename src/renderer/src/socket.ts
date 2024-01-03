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
        });
        instance.on("connect",() => {
            socket.onConnect(id);
            const engine = instance.io.engine;

            engine.once("upgrade",() => {
                console.log(engine.transport.name);
            });
            engine.on("packet",({ type, data }) => {
                console.log("Packet received from server!", type, data);
            });
            engine.on("packetCreate",({ type, data }) => {
                console.log("Packet sent to server!", type, data);
            });
            engine.on("drain",() => {
                console.log("Write buffer is drained!");
            });
            engine.on("close",(reason) => {
                socket.onDisconnect(id, reason);
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

    public static disconnect(
        id: string,
        status: InstanceStatus,
        reason?: string,
    ){
        socket.instances.every((instance) => {
            if (instance.id === id){
                instance.io.disconnect();
                return true;
            }
            return false;
        });
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
}
