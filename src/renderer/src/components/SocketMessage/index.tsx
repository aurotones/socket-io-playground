import { useMemo } from "react";
import formatTime from "../../utils/formatTime";
import MessageInterface from "../../interfaces/MessageInterface";

interface Props {
    data: MessageInterface,
}

export default function SocketMessage(props: Props){

    const formattedTime = useMemo(() => {
        return formatTime(props.data.timestamp);
    },[]);

    const message = useMemo(() => {
        try {
            JSON.parse(props.data.message);
            return props.data.message;
        } catch (e){
            return props.data.message;
        }
    },[]);

    return (
        <div
            key={`msg-${props.data.instanceId}-${props.data.timestamp}`}
            className="message px-4 py-1 font-mono"
        >
            <div className="flex">
                <div className="opacity-60">
                    { props.data.type }
                </div>
                <div className="flex-1"/>
                <div className="opacity-60">
                    { formattedTime }
                </div>
            </div>
            <div>
                { message }
            </div>
        </div>
    )
}
