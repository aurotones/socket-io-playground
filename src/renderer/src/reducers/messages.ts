import REDUCER_CONSTANTS from "../enums/REDUCER_CONSTANTS";
import MessageState from "../interfaces/reducers/MessageState";
import ReducerAction from "../interfaces/ReducerAction";

const initialState: MessageState = {
    messages: [],
}

export default function (state = initialState, action: ReducerAction){
    switch (action.type){
        case REDUCER_CONSTANTS.MESSAGE_ON_RECEIVE:
            if (action.payload){
                const messages = state.messages.slice();
                if (messages.length > 100){
                    messages.shift();
                }
                return {
                    ...state,
                    messages: [
                        ...messages,
                        action.payload,
                    ]
                }
            }
            return state;
        case REDUCER_CONSTANTS.MESSAGE_CLEAR:
            if (action.payload){
                return {
                    ...state,
                    messages: state.messages.filter((msg) => {
                        return msg.instanceId !== action.payload;
                    }),
                }
            }
            return state;
        default:
            return state;
    }
}
