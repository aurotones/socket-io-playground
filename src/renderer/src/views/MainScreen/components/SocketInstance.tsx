import { useCallback, useState } from "react";
import Tabs from "../../../components/Tabs";
import SocketInstanceMessages from "./SocketInstanceMessages";
import SocketInstanceSend from "./SocketInstanceSend";
import InstanceInterface from "../../../interfaces/InstanceInterface";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketInstance(props: Props){
    const [tabIndex, setTabIndex] = useState(0);

    const renderTabView = useCallback(() => {
        switch (tabIndex){
            case 0:
                return (
                    <SocketInstanceMessages currentInstance={props.currentInstance}/>
                );
            case 1:
                return (
                    <SocketInstanceSend currentInstance={props.currentInstance}/>
                );
            default:
                return null;
        }
    },[tabIndex]);

    return (
        <div className="flex flex-1 flex-col">
            <Tabs
                tabs={[
                    "Messages",
                    "Emit",
                ]}
                value={tabIndex}
                onTabChange={setTabIndex}
            />
            <div
                className="flex-1"
                style={{
                    height: 0,
                    overflowY: "auto",
                }}
            >
                { renderTabView() }
            </div>
        </div>
    )
}
