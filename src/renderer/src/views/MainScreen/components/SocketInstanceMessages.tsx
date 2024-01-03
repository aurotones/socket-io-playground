import { useMemo } from "react";
import { useSelector } from "react-redux";
import MessageState from "../../../interfaces/reducers/MessageState";
import { RootState } from "../../../store";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import SocketMessage from "../../../components/SocketMessage";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketInstanceMessages(props: Props){
    const messages: MessageState = useSelector((state: RootState) => state.messages);

    const filteredMessages = useMemo(() => {
        return messages.messages.filter((message) => {
            return message.instanceId === props.currentInstance?.id;
        });
    },[
        props.currentInstance?.id,
        messages.messages,
    ]);

    return filteredMessages.map((data) =>
        <SocketMessage
            data={data}
        />
    )
}
