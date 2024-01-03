import REDUCER_CONSTANTS from "../enums/REDUCER_CONSTANTS";
import InstanceInterface, {InstanceStatus} from "../interfaces/InstanceInterface";

export default class socketActions {
    static createInstance(){
        const payload = {
            id: String(Date.now()),
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

    static setInstanceOpts(opts: string){
        return {
            type: REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_OPTS,
            payload: opts,
        }
    }
}
