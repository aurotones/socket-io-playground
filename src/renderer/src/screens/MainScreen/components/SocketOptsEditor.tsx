import { useState } from "react";
import { useDispatch } from "react-redux";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import Tabs from "../../../components/Tabs";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketOptsEditor(props: Props){
    const dispatch = useDispatch();
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <div>
            <Tabs
                tabs={[
                    "Query",
                    "Auth",
                    "Header"
                ]}
                value={tabIndex}
                onTabChange={setTabIndex}
            />
            <div className="px-4 py-2">

            </div>
        </div>
    )
}
