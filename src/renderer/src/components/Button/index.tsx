import { useMemo } from "react";
import Ink from "react-ink";

interface Props {
    className?: string,
    disabled?: boolean,
    style?: any,
    onClick: () => void,
    children: string,
}

export default function Button(props: Props){
    const classNames = useMemo(() => {
        let value = "relative px-4 py-2 text-sm text-center cursor-pointer rounded-lg select-none";
        if (props.disabled){
            value += " opacity-30 pointer-events-none"
        }
        if (props.className){
            value += ` ${props.className}`;
        }
        return value;
    },[
        props.className,
        props.disabled,
    ]);

    return (
        <div
            className={classNames}
            style={props.style}
            onClick={props.onClick}
        >
            { props.children }
            <Ink/>
        </div>
    )
}
