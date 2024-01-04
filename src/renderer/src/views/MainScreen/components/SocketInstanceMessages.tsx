import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import MessageState from "../../../interfaces/reducers/MessageState";
import { RootState } from "../../../store";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import SocketMessage from "../../../components/SocketMessage";
import SocketInstanceMessageToolbar from "./SocketInstanceMessageToolbar";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketInstanceMessages(props: Props){
    const msgContainer = useRef<any>();
    const childContainer = useRef<any>();
    const messages: MessageState = useSelector((state: RootState) => state.messages);

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        },1);
    },[]);

    const filteredMessages = useMemo(() => {
        return messages.messages.filter((message) => {
            return message.instanceId === props.currentInstance?.id;
        });
    },[
        props.currentInstance?.id,
        messages.messages,
    ]);

    useEffect(() => {
        if (props.currentInstance.options?.scrollToEnd){
            scrollToBottom();
        }
    },[
        filteredMessages,
        props.currentInstance.options?.scrollToEnd,
    ]);

    const scrollToBottom = () => {
        setTimeout(() => {
            msgContainer.current.scrollTo({
                top: 99999999999999,
            });
        },1);
    }

    return (
        <div className="flex flex-1 flex-col" style={{ height: 0 }}>
            <SocketInstanceMessageToolbar
                currentInstance={props.currentInstance}
            />
            <div
                ref={msgContainer}
                className="flex-1 bg-[#151515]"
                style={{
                    height: 0,
                    overflowY: "auto",
                }}
            >
                <div ref={childContainer}>
                    {
                        filteredMessages.map((data, i) =>
                            <SocketMessage
                                key={`message-${data.instanceId}-${data.id}`}
                                data={data}
                                index={i}
                            />
                        )
                    }
                </div>
            </div>
        </div>
    )
}
