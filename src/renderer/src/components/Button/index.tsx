import { useMemo } from "react";
import Ink from "react-ink";
import classNames from "classnames";
import "./Button.scss";

interface Props {
    icon?: boolean,
    className?: string,
    disabled?: boolean,
    style?: any,
    onClick: () => void,
    children: any,
}

export default function Button(props: Props){
    const classes = useMemo(() => {
        let value = classNames("ui-button relative text-sm text-center cursor-pointer select-none",{
            "px-4": !props.icon,
            "icon": props.icon,
        });
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
            className={classes}
            style={props.style}
            onClick={props.onClick}
        >
            { props.children }
            <Ink/>
        </div>
    )
}

Button.defaultProps = {
    icon: false,
}
