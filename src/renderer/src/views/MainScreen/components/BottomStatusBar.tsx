import {useEffect, useMemo, useState} from "react";
import colors from "tailwindcss/colors";
import GitHubButton from "react-github-btn";
import InstanceInterface, { InstanceStatus } from "../../../interfaces/InstanceInterface";

interface Props {
    currentInstance: InstanceInterface,
}

export default function BottomStatusBar(props: Props){
    const [versionStr, setVersionString] = useState("");

    useEffect(() => {
        window.api.getAppInfo().then((appInfo) => {
            setVersionString(`v${appInfo.version} ${appInfo.platform} (${appInfo.arch})`);
        });
    },[]);

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
        <div className="flex px-4 py-2 text-xs bottom-status-bar items-center">
            <div
                className="opacity-80"
                style={{ color: status.labelColor }}
            >
                <span>
                    Status: { status.label }
                </span>
                { props.currentInstance.reason ? renderReason() : null }
            </div>
            <div className="flex-1"/>
            <div className="mr-3 opacity-80">
                { versionStr }
            </div>
            <div
                className="flex justify-center"
                style={{height: 21}}
            >
                <GitHubButton
                    href="https://github.com/aurotones/socket-io-playground"
                    data-icon="octicon-star"
                    data-show-count={true}
                    aria-label="Star aurotones/socket-io-playground on GitHub"
                >
                    Star
                </GitHubButton>
            </div>
        </div>
    )
}
