import { useMemo, useState } from "react";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import socket from "../../../socket";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketInstanceSend(props: Props){
    const [type, setType] = useState("");
    const [message, setMessage] = useState("");

    const disableSubmit = useMemo(() => {
        if (type.length === 0){
            return true;
        }
        return message.length === 0;
    },[
        type,
        message,
    ]);

    const emitToServer = () => {
        if (disableSubmit){
            return;
        }
        socket.emitToServer(
            props.currentInstance.id,
            type,
            message,
        );
        setType("");
        setMessage("");
    }

    return (
        <div className="p-4">
            <div className="flex items-center">
                <div
                    style={{ flex: 1 }}
                    className="text-sm"
                >
                    Type:
                </div>
                <div style={{ flex: 6 }}>
                    <Input
                        value={type}
                        onChangeText={setType}
                    />
                </div>
            </div>
            <div className="h-4"/>
            <div className="flex items-center">
                <div
                    style={{ flex: 1 }}
                    className="text-sm"
                >
                    Message:
                </div>
                <div style={{ flex: 6 }}>
                    <Input
                        value={message}
                        onChangeText={setMessage}
                    />
                </div>
            </div>
            <div className="h-4"/>
            <div className="flex">
                <div className="flex-1"/>
                <Button
                    className="bg-blue-700"
                    disabled={disableSubmit}
                    onClick={emitToServer}
                >
                    Emit
                </Button>
            </div>
        </div>
    )
}
