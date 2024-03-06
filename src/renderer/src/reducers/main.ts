import REDUCER_CONSTANTS from "../enums/REDUCER_CONSTANTS";
import MainState from "../interfaces/reducers/MainState";
import ReducerAction from "../interfaces/ReducerAction";
import { InstanceStatus } from "../interfaces/InstanceInterface";

const initialState: MainState = {
    instances: [],
    activeInstance: null,
}

export default function (state = initialState, action: ReducerAction){
    switch (action.type){
        case REDUCER_CONSTANTS.SOCKET_CREATE_INSTANCE:
            return {
                ...state,
                instances: [
                    ...state.instances,
                    action.payload,
                ],
                activeInstance: state.instances.length,
            }
        case REDUCER_CONSTANTS.SOCKET_REMOVE_INSTANCE:
            return {
                ...state,
                instances: state.instances.filter((instance) => {
                    return instance.id !== action.payload.id;
                }),
                activeInstance: state.activeInstance !== action.payload.id ? (
                    state.activeInstance
                ) : null,
            }
        case REDUCER_CONSTANTS.SOCKET_CHANGE_ACTIVE_INSTANCE:
            return {
                ...state,
                activeInstance: action.payload,
            }
        case REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_STATUS:
            if (action.payload){
                const instances = state.instances.slice();
                instances.find((instance) => {
                    if (instance.id === action.payload.id){
                        instance.status = action.payload.status;
                        if ((action.payload.status === InstanceStatus.IDLE ||
                            action.payload.status === InstanceStatus.ERROR)
                            && action.payload.reason){
                            instance.reason = action.payload.reason;
                        } else {
                            instance.reason = null;
                        }
                        return true;
                    }
                    return false;
                });
                return {
                    ...state,
                    instances,
                }
            }
            return state;
        case REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_URI:
            if (typeof state.activeInstance === "number"){
                const instances = state.instances.slice();
                instances.find((instance, i) => {
                    if (state.activeInstance === i){
                        instance.uri = action.payload;
                        return true;
                    }
                    return false;
                });
                return {
                    ...state,
                    instances,
                }
            }
            return state;
        case REDUCER_CONSTANTS.SOCKET_SET_INSTANCE_OPTS:
            if (typeof state.activeInstance === "number"){
                const instances = state.instances.slice();
                instances.find((instance, i) => {
                    if (state.activeInstance === i){
                        instance.opts = action.payload;
                        return true;
                    }
                    return false;
                });
                return {
                    ...state,
                    instances,
                }
            }
            return state;
        case REDUCER_CONSTANTS.SOCKET_SET_OPTS:
            if (typeof state.activeInstance === "number"){
                const instances = state.instances.slice();
                instances.forEach((instance, i) => {
                    if (state.activeInstance === i){
                        instance.options = action.payload;
                        return true;
                    }
                    return false;
                });
                return {
                    ...state,
                    instances,
                }
            }
            return state;
        default:
            return state;
    }
}
