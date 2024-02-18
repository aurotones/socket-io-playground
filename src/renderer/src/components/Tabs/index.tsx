import classNames from "classnames";
import "./Tabs.scss";

interface Props {
    tabs: string[],
    value: number,
    onTabChange: (tabIndex: number) => void,
}

export default function Tabs(props: Props){

    const renderItem = (tab, index) => {
        const active = props.value === index;
        return (
            <div
                key={`tab-${index}`}
                className={classNames("item px-5 py-3 text-xs select-none",{
                    active,
                })}
                onClick={() => props.onTabChange(index)}
            >
                { tab }
            </div>
        )
    }

    return (
        <div className="tabs">
            <div className="flex">
                {
                    props.tabs.map((tab, i) =>
                        renderItem(tab, i)
                    )
                }
            </div>
        </div>
    )
}
