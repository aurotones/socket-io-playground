import { useMemo } from "react";
import InstanceInterface, {InstanceStatus} from "../../../interfaces/InstanceInterface";
import colors from "tailwindcss/colors";

interface Props {
    currentInstance: InstanceInterface,
    submit: () => void,
}

export default function SubmitButton(props: Props){
    const buttonState = useMemo(() => {
        let backgroundColor = colors.blue[600] as string;
        let label = "";
        switch (props.currentInstance?.status){
            case InstanceStatus.IDLE:
                label = "Connect";
                break;
            case InstanceStatus.CONNECTING:
                label = "Connecting";
                backgroundColor = "#666";
                break;
            case InstanceStatus.CONNECTED:
                label = "Disconnect";
                break;
            case InstanceStatus.ERROR:
                label = "Reconnect";
                break;
        }
        return { style: { backgroundColor }, label };
    },[props.currentInstance?.status]);

    return (
        <div
            className="px-4 py-2 text-sm cursor-pointer rounded-lg"
            style={buttonState.style}
            onClick={props.submit}
        >
            { buttonState.label }
        </div>
    )
}
