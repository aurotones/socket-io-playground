import { v4 as uuidv4 } from "uuid";
import { SocketOptions } from "socket.io-client";
import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { Packet } from "engine.io-parser/build/esm/commons";
import REDUCER_CONSTANTS from "../enums/REDUCER_CONSTANTS";
import InstanceInterface, { InstanceStatus } from "../interfaces/InstanceInterface";
import MessageInterface, { MessageStatus } from "../interfaces/MessageInterface";
import { store } from "../store";

export default class socketActions {
    static createInstance(){
        const payload = {
            id: uuidv4(),
            title: "",
            uri: "",
            opts: {
                retries: 1,
                forceNew: true,
                path: "/socket.io",
            },
            status: InstanceStatus.IDLE,
            options: {
                preserveMessages: true,
                limitMessages: 100,
            },
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
        return {
            type: REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_OPTS,
            payload: opts,
        }
    }

    static setOptions(opts: InstanceInterface["options"]){
        return {
            type: REDUCER_CONSTANTS.SOCKET_SET_OPTS,
            payload: opts,
        }
    }

    static onMsgReceive(instanceId: string, packet: Packet){
        try {
            let message = null;
            let parsed = null;
            let playSound = false;
            store.getState().main.instances.find((instance) => {
                if (instance.id === instanceId){
                    playSound = instance.options.playSound;
                    return true;
                }
                return false;
            });
            switch (typeof packet.data){
                case "string":
                    parsed = JSON.parse(packet.data);
                    break;
                case "object":
                    if (packet.data instanceof ArrayBuffer){
                        console.log("received array buffer!");
                        message = {
                            id: uuidv4(),
                            instanceId,
                            type: "ArrayBuffer attachment received!",
                            message: "Open developer tool to inspect",
                            timestamp: Date.now(),
                            status: MessageStatus.WARNING,
                        } satisfies MessageInterface;
                    }
                    break;
            }
            if (parsed){
                message = {
                    id: uuidv4(),
                    instanceId,
                    type: parsed[0],
                    message: parsed[1],
                    timestamp: Date.now(),
                    status: MessageStatus.SUCCESS,
                } satisfies MessageInterface;
            }
            if (playSound){
                playNotificationAudio().then();
            }
            return {
                type: REDUCER_CONSTANTS.MESSAGE_ON_RECEIVE,
                payload: message,
            }
        } catch (e){
            console.error(e);
            return {
                type: REDUCER_CONSTANTS.MESSAGE_ON_RECEIVE,
                payload: null,
            }
        }
    }

    static clearMessages(id: string){
        return {
            type: REDUCER_CONSTANTS.MESSAGE_CLEAR,
            payload: id,
        }
    }
}

export async function playNotificationAudio(){
    try {
        const audio = new Audio("/assets/notification.wav");
        audio.volume = 0.2;
        audio.addEventListener("ended",() => {
            audio.remove();
        });
        await audio.play();
    } catch (e){
        console.error(e);
    }
}
