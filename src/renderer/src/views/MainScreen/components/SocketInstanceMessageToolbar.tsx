import { useDispatch } from "react-redux";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import socketActions, {playNotificationAudio} from "../../../actions/socketActions";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketInstanceMessageToolbar(props: Props){
    const dispatch = useDispatch();

    const preserveHandler = () => {
        const preserve = props.currentInstance.options?.preserveMessages;
        dispatch(socketActions.setOptions({
            ...props.currentInstance.options,
            preserveMessages: !preserve,
        }));
    }

    const snapHandler = () => {
        const scrollToEnd = props.currentInstance.options?.scrollToEnd;
        dispatch(socketActions.setOptions({
            ...props.currentInstance.options,
            scrollToEnd: !scrollToEnd,
        }));
    }

    const playSoundHandler = () => {
        playNotificationAudio().then();
        const playSound = props.currentInstance.options?.playSound;
        dispatch(socketActions.setOptions({
            ...props.currentInstance.options,
            playSound: !playSound,
        }));
    }

    const clearMessage = () => {
        dispatch(socketActions.clearMessages(props.currentInstance.id));
    }

    return (
        <div className="message-toolbar select-none">
            <div className="flex px-4 py-2 text-xs items-center cursor-pointer">
                <span
                    className="ml-1 opacity-80"
                    onClick={clearMessage}
                >
                    Clear
                </span>
                <div className="liner-v mx-4"/>
                <input
                    type="checkbox"
                    checked={props.currentInstance.options?.preserveMessages}
                    onChange={preserveHandler}
                />
                <span
                    className="ml-2 opacity-80"
                    onClick={preserveHandler}
                >
                    Preserve message
                </span>
                <div className="liner-v mx-4"/>
                <input
                    type="checkbox"
                    checked={props.currentInstance.options?.scrollToEnd}
                    onChange={snapHandler}
                />
                <span
                    className="ml-2 opacity-80"
                    onClick={snapHandler}
                >
                    Auto scroll
                </span>
                <div className="liner-v mx-4"/>
                <input
                    type="checkbox"
                    checked={props.currentInstance.options?.playSound}
                    onChange={playSoundHandler}
                />
                <span
                    className="ml-2 opacity-80"
                    onClick={playSoundHandler}
                >
                    Play sound
                </span>
                {/*<div className="liner-v mx-4"/>*/}
                {/*<span className="opacity-80">*/}
                {/*    Limit:*/}
                {/*</span>*/}
                {/*<input*/}
                {/*    className="ml-2"*/}
                {/*    value={props.currentInstance?.options?.limitMessages}*/}
                {/*    onChange={(e) => {*/}
                {/*        limitMsgHandler(e.target.value);*/}
                {/*    }}*/}
                {/*    type="number"*/}
                {/*    min={20}*/}
                {/*    max={200}*/}
                {/*/>*/}
            </div>
            <div className="liner"/>
        </div>
    )
}
