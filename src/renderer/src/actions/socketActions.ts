import { v4 as uuidv4 } from "uuid";
import { SocketOptions } from "socket.io-client";
import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { Packet } from "engine.io-parser/build/esm/commons";
import REDUCER_CONSTANTS from "../enums/REDUCER_CONSTANTS";
import InstanceInterface, { InstanceStatus } from "../interfaces/InstanceInterface";
import MessageInterface from "../interfaces/MessageInterface";

export default class socketActions {
    static createInstance(){
        const payload = {
            id: uuidv4(),
            title: "",
            uri: "",
            opts: {},
            status: InstanceStatus.IDLE,
        } satisfies InstanceInterface;

        return {
            type: REDUCER_CONSTANTS.SOCKET_CREATE_INSTANCE,
            payload,
        }
    }

    static changeActiveInstance(index: number){
        return {
            type: REDUCER_CONSTANTS.SOCKET_CHANGE_ACTIVE_INSTANCE,
            payload: index,
        }
    }

    static setInstanceStatus(id: string, status: InstanceStatus, reason?: string){
        return {
            type: REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_STATUS,
            payload: {
                id,
                status,
                reason,
            },
        }
    }

    static setInstanceUri(uri: string){
        return {
            type: REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_URI,
            payload: uri,
        }
    }

    static setInstanceOpts(opts: Partial<ManagerOptions & SocketOptions>){
        console.log(opts);
        return {
            type: REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_OPTS,
            payload: opts,
        }
    }

    static onMsgReceive(instanceId: string, packet: Packet){
        let message = null;
        console.log(packet.data);
        try {
            const parsed = JSON.parse(packet.data);

            message = {
                instanceId,
                type: parsed[0],
                message: parsed[1],
                timestamp: Date.now(),
            } satisfies MessageInterface;

            return {
                type: REDUCER_CONSTANTS.MESSAGE_ON_RECEIVE,
                payload: message,
            }
        } catch (e){
            return {
                type: REDUCER_CONSTANTS.MESSAGE_ON_RECEIVE,
                payload: message,
            }
        }
    }
}
