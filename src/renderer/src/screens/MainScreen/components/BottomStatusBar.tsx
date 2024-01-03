import { useMemo } from "react";
import InstanceInterface, { InstanceStatus } from "../../../interfaces/InstanceInterface";
import colors from "tailwindcss/colors";

interface Props {
    currentInstance: InstanceInterface,
}

export default function BottomStatusBar(props: Props){

    const status = useMemo(() => {
        let label = null;
        let labelColor = null;
        switch (props.currentInstance?.status){
            case InstanceStatus.IDLE:
                label = "Idle";
                labelColor = "#ddd";
                break;
            case InstanceStatus.CONNECTING:
                label = "Connecting...";
                labelColor = "#ddd";
                break;
            case InstanceStatus.CONNECTED:
                label = "Connected";
                labelColor = colors.green[600];
                break;
            case InstanceStatus.ERROR:
                label = "Error";
                labelColor = colors.red[600];
                break;
        }
        return {
            label,
            labelColor,
        };
    },[props.currentInstance?.status]);

    const renderReason = () => {
        return (
            <span>
                , Reason: { props.currentInstance.reason }
            </span>
        )
    }

    return (
        <div className="px-4 py-2 text-xs bottom-status-bar">
            <div className="opacity-70" style={{ color: status.labelColor }}>
                <span>Status: { status.label }</span>
                {
                    props.currentInstance.reason ? renderReason() : null
                }
            </div>
        </div>
    )
}
