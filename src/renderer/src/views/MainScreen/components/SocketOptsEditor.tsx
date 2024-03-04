import { useCallback, useState } from "react";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import Tabs from "../../../components/Tabs";
import SocketOptsEditorQuery from "./SocketOptsEditorQuery";
import SocketOptsEditorAuth from "./SocketOptsEditorAuth";
import SocketOptsEditorHeader from "./SocketOptsEditorHeader";
import SocketOptsRaw from "./SocketOptsRaw";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketOptsEditor(props: Props){
    const [tabIndex, setTabIndex] = useState(0);

    const renderTabView = useCallback(() => {
        switch (tabIndex){
            case 0:
                return (
                    <SocketOptsEditorQuery
                        currentInstance={props.currentInstance}
                    />
                );
            case 1:
                return (
                    <SocketOptsEditorAuth
                        currentInstance={props.currentInstance}
                    />
                );
            case 2:
                return (
                    <SocketOptsEditorHeader
                        currentInstance={props.currentInstance}
                    />
                );
            case 3:
                return (
                    <SocketOptsRaw
                        currentInstance={props.currentInstance}
                    />
                );
            default:
                return null;
        }
    },[
        tabIndex,
        props.currentInstance,
    ]);

    return (
        <div className="flex-1">
            <Tabs
                tabs={[
                    "Query",
                    "Auth",
                    "Headers",
                    "Raw",
                ]}
                value={tabIndex}
                onTabChange={setTabIndex}
            />
            <div className="px-4 py-2">
                { renderTabView() }
            </div>
        </div>
    )
}
