import classNames from "classnames";
import { useMemo } from "react";
import usePropsExcept from "../../hooks/usePropsExcept";

interface Props {
    style?: any,
    value: string,
    disabled?: boolean,
    className?: string,
    placeholder?: string,
    onChangeText?: (value: string) => void,
}

export default function Input(props: Props){
    const filteredProps = usePropsExcept(props,["onChangeText"]);

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
                {...filteredProps}
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
