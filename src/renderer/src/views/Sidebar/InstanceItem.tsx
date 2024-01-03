import { useMemo } from "react";
import { useDispatch } from "react-redux";
import colors from 'tailwindcss/colors'
import InstanceInterface, { InstanceStatus } from "../../interfaces/InstanceInterface";
import socketActions from "../../actions/socketActions";

interface Props {
    instance: InstanceInterface,
    active: boolean,
    index: number,
}

export default function InstanceItem(props: Props){
    const dispatch = useDispatch();

    const formatName = useMemo(() => {
        let value: any = (
            <span className="opacity-50">
                New instance
            </span>
        );

        if (props.instance.title.length > 0){
            value = props.instance.title;
        } else if (props.instance.uri.length > 0){
            value = props.instance.uri;
        }

        return value;
    },[
        props.instance.uri,
        props.instance.title,
    ]);

    const containerStyle = useMemo(() => {
        let value = {
            borderWidth: 2,
        };

        if (props.active){
            switch (props.instance.status){
                case InstanceStatus.IDLE:
                    value["backgroundColor"] = "#444";
                    break;
                case InstanceStatus.CONNECTING:
                    value["backgroundColor"] = colors.blue[600];
                    break;
                case InstanceStatus.CONNECTED:
                    value["backgroundColor"] = colors.green[600];
                    break;
                case InstanceStatus.ERROR:
                    value["backgroundColor"] = colors.red[600];
                    break;
            }
        }
        switch (props.instance.status){
            case InstanceStatus.IDLE:
                value["borderColor"] = "#444";
                break;
            case InstanceStatus.CONNECTING:
                value["borderColor"] = colors.blue[600];
                break;
            case InstanceStatus.CONNECTED:
                value["borderColor"] = colors.green[600];
                break;
            case InstanceStatus.ERROR:
                value["borderColor"] = colors.red[600];
                break;
        }

        return value;
    },[
        props.instance.status,
        props.active,
    ]);

    const onClick = () => {
        dispatch(socketActions.changeActiveInstance(props.index));
    }

    return (
        <div
            className="mt-1 mb-4 px-4 py-2 text-sm cursor-pointer rounded-lg"
            style={containerStyle}
            onClick={onClick}
        >
            { formatName }
        </div>
    )
}
