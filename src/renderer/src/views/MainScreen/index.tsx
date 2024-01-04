import {useEffect, useMemo} from "react";
import { useDispatch, useSelector } from "react-redux";
import MainState from "../../interfaces/reducers/MainState";
import InstanceInterface, { InstanceStatus } from "../../interfaces/InstanceInterface";
import SubmitButton from "./components/SubmitButton";
import BottomStatusBar from "./components/BottomStatusBar";
import SocketOptsEditor from "./components/SocketOptsEditor";
import socketActions from "../../actions/socketActions";
import { RootState } from "../../store";
import socket from "../../socket";
import Input from "../../components/Input";
import "./MainScreen.scss";
import SocketInstance from "./components/SocketInstance";

let timeout = null;

export default function MainScreen(){
    const dispatch = useDispatch();
    const main: MainState = useSelector((state: RootState) => state.main);

    useEffect(() => {
        timeout = setTimeout(() => {
            if (main.instances.length === 0){
                dispatch(socketActions.createInstance());
            }
        },10);
        return () => {
            clearTimeout(timeout);
        }
    },[]);

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
    },[
        currentInstance?.status,
    ]);

    const disableSubmitButton = useMemo(() => {
        return !(typeof currentInstance?.uri === "string" && currentInstance?.uri.length > 0);

    },[
        currentInstance?.uri,
    ])

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
                <Input
                    value={currentInstance.uri}
                    disabled={disableInput}
                    placeholder="http://localhost:8000"
                    onChangeText={socketUriHandler}
                />
                <div className="w-4"/>
                <SubmitButton
                    disabled={disableSubmitButton}
                    currentInstance={currentInstance}
                    submit={submit}
                />
            </div>
            <div className="liner"/>
            <div className="flex flex-1" style={{ height: 0 }}>
                {
                    currentInstance.status === InstanceStatus.IDLE ||
                    currentInstance.status === InstanceStatus.ERROR ? (
                        <SocketOptsEditor
                            currentInstance={currentInstance}
                        />
                    ) : (
                        <SocketInstance
                            currentInstance={currentInstance}
                        />
                    )
                }
            </div>
            <div className="liner"/>
            <BottomStatusBar
                currentInstance={currentInstance}
            />
        </div>
    )
}
