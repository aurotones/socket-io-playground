import {useCallback, useMemo, useState} from "react";
import InstanceInterface, {InstanceStatus} from "../../../interfaces/InstanceInterface";
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

    const loading = useMemo(() => {
        return props.currentInstance?.status === InstanceStatus.CONNECTING;
    },[props.currentInstance?.status]);

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
        <div
            className="flex-1"
            style={{
                opacity: loading ? 0.4 : 1,
                pointerEvents: loading ? "none" : "auto",
            }}
        >
            <Tabs
                tabs={[
                    "Path & Queries",
                    "Authorization",
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
