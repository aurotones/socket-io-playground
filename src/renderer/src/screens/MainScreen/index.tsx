import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import MainState from "../../interfaces/reducers/MainState";
import InstanceInterface, {InstanceStatus} from "../../interfaces/InstanceInterface";
import {RootState} from "../../store";
import socket from "../../socket";
import socketActions from "../../actions/socketActions";
import SubmitButton from "./components/SubmitButton";
import BottomStatusBar from "./components/BottomStatusBar";
import "./MainScreen.scss";
import SocketOptsEditor from "./components/SocketOptsEditor";

export default function MainScreen(){
    const dispatch = useDispatch();
    const main: MainState = useSelector((state: RootState) => state.main);

    const currentInstance: InstanceInterface = useMemo(() => {
        let value = null;
        if (main.instances[main.activeInstance]){
            value = main.instances[main.activeInstance];
        }
        return value;
    },[main.instances, main.activeInstance]);

    const disableInput = useMemo(() => {
        switch (currentInstance?.status){
            case InstanceStatus.CONNECTING:
            case InstanceStatus.CONNECTED:
                return true;
            default:
                return false
        }
    },[currentInstance?.status]);

    const socketUriHandler = (uri: string) => {
        dispatch(socketActions.setInstanceUri(uri));
    }

    const submit = () => {
        switch (currentInstance.status){
            case InstanceStatus.IDLE:
            case InstanceStatus.ERROR:
                socket.connect(
                    currentInstance.id,
                    currentInstance.uri,
                    currentInstance.opts,
                );
                break;
            case InstanceStatus.CONNECTED:
                socket.disconnect(currentInstance.id, InstanceStatus.IDLE);
                break;
        }
    }

    if (!currentInstance){
        return null;
    }

    return (
        <div className="main flex flex-col flex-1">
            <div className="flex p-4">
                <div
                    className={classNames("input-cont",{
                        disabled: disableInput,
                    })}
                >
                    <input
                        disabled={disableInput}
                        className="flex-1 text-sm"
                        placeholder="localhost:8000"
                        value={currentInstance.uri}
                        onChange={(e) => {
                            socketUriHandler(e.target.value);
                        }}
                    />
                </div>
                <div className="w-4"/>
                <SubmitButton
                    currentInstance={currentInstance}
                    submit={submit}
                />
            </div>
            <div className="liner"/>
            <div className="flex-1">
                {
                    currentInstance.status === InstanceStatus.IDLE ||
                    currentInstance.status === InstanceStatus.ERROR ? (
                        <SocketOptsEditor
                            currentInstance={currentInstance}
                        />
                    ) : null
                }
            </div>
            <div className="liner"/>
            <BottomStatusBar
                currentInstance={currentInstance}
            />
        </div>
    )
}
