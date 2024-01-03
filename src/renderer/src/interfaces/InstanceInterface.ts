import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { SocketOptions } from "socket.io-client/build/esm/socket";

export enum InstanceStatus {
    IDLE,
    CONNECTING,
    CONNECTED,
    ERROR,
}

interface InstanceInterface {
    id: string,
    uri: string,
    title?: string,
    opts?: Partial<ManagerOptions & SocketOptions>,
    status?: InstanceStatus,
    reason?: string,
}

export default InstanceInterface;
