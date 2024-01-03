import { useMemo } from "react";
import InstanceInterface, {InstanceStatus} from "../../../interfaces/InstanceInterface";
import colors from "tailwindcss/colors";
import Button from "../../../components/Button";

interface Props {
    disabled: boolean,
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
        <Button
            style={buttonState.style}
            disabled={props.disabled}
            onClick={props.submit}
        >
            { buttonState.label }
        </Button>
    )
}
