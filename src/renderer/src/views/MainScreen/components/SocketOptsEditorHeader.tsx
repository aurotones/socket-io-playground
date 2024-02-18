import { useMemo } from "react";
import { useDispatch } from "react-redux";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import AuthOptionInput from "./AuthOptionInput";
import socketActions from "../../../actions/socketActions";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketOptsEditorHeader(props: Props){
    const dispatch = useDispatch();

    const extraHeaders = useMemo<{
        name: string,
        value: string,
    }[]>(() => {
        let values = [];
        if (props.currentInstance?.opts?.extraHeaders){
            Object.keys(props.currentInstance.opts.extraHeaders).map((key) => {
                values.push({
                    name: key,
                    value: props.currentInstance.opts.extraHeaders[key],
                });
            });
        }
        return values;
    },[
        props.currentInstance?.opts,
    ]);

    const onSave = (options: { name: string, value: string }) => {
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            extraHeaders: {
                ...props.currentInstance.opts.extraHeaders,
                [options["name"]]: options.value,
            },
        }));
    }

    const onEdit = (options: { name: string, value: string }, prevName: string) => {
        let extraHeaders = props.currentInstance.opts.extraHeaders;
        if (options.name !== prevName){
            delete extraHeaders[prevName];
        }
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            extraHeaders: {
                ...extraHeaders,
                [options["name"]]: options.value,
            },
        }));
    }

    const onRemove = (name: string) => {
        let extraHeaders = props.currentInstance.opts.extraHeaders;
        delete extraHeaders[name];
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            extraHeaders,
        }));
    }

    return (
        <div>
            <span className="text-white opacity-50 text-xs">
                Extra headers:
            </span>
            {
                extraHeaders.map((header, i) =>
                    <AuthOptionInput
                        key={`header-${i}`}
                        auth={header}
                        onEdit={(value) => onEdit(value, header.name)}
                        onRemove={() => onRemove(header.name)}
                    />
                )
            }
            <AuthOptionInput
                new={true}
                onSave={onSave}
            />
        </div>
    )
}
