import { useMemo } from "react";
import { useDispatch } from "react-redux";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import AuthOptionInput from "./AuthOptionInput";
import socketActions from "../../../actions/socketActions";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketOptsEditorAuth(props: Props){
    const dispatch = useDispatch();

    const authOptions = useMemo<{
        name: string,
        value: string,
    }[]>(() => {
        let values = [];
        if (props.currentInstance?.opts?.auth){
            Object.keys(props.currentInstance.opts.auth).map((key) => {
                values.push({
                    name: key,
                    value: props.currentInstance.opts.auth[key],
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
            auth: {
                ...props.currentInstance.opts.auth,
                [options["name"]]: options.value,
            },
        }));
    }

    const onEdit = (options: { name: string, value: string }, prevName: string) => {
        let auth = props.currentInstance.opts.auth;
        if (options.name !== prevName){
            delete auth[prevName];
        }
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            auth: {
                ...auth,
                [options["name"]]: options.value,
            },
        }));
    }

    const onRemove = (name: string) => {
        let auth = props.currentInstance.opts.auth;
        delete auth[name];
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            auth,
        }));
    }

    return (
        <div>
            <span className="text-white opacity-50 text-xs">
                Authorization options:
            </span>
            {
                authOptions.map((auth, i) =>
                    <AuthOptionInput
                        key={`auth-${i}`}
                        auth={auth}
                        onEdit={(value) => onEdit(value, auth.name)}
                        onRemove={() => onRemove(auth.name)}
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
