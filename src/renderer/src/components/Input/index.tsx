import classNames from "classnames";
import {useMemo} from "react";

interface Props {
    style?: any,
    value: string,
    disabled?: boolean,
    className?: string,
    placeholder?: string,
    onChangeText?: (value: string) => void,
}

export default function Input(props: Props){

    const _classNames = useMemo(() => {
        let value = "input-cont";
        if (props.className){
            value += ` ${props.className}`;
        }
        return value;
    },[props.className])

    return (
        <div
            className={classNames(_classNames, {
                disabled: props.disabled,
            })}
        >
            <input
                {...props}
                disabled={props.disabled}
                className="flex-1 text-sm"
                value={props.value}
                onChange={(e) => {
                    props.onChangeText(e.target.value);
                }}
            />
        </div>
    )
}
