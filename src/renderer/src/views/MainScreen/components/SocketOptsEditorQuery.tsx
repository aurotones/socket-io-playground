import queryString from "query-string";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import Input from "../../../components/Input";
import QueryInput from "./QueryInput";
import socketActions from "../../../actions/socketActions";

interface Props {
    currentInstance: InstanceInterface,
}

export default function SocketOptsEditorQuery(props: Props){
    const dispatch = useDispatch();

    const value = useMemo(() => {
        let value = props.currentInstance?.uri;
        if (props.currentInstance?.opts?.query){
            value += "?" + queryString.stringify(props.currentInstance?.opts.query);
        }
        return value;
    },[
        props.currentInstance?.uri,
        props.currentInstance?.opts,
    ]);

    const queries = useMemo<{
        name: string,
        value: string,
    }[]>(() => {
        let values = [];
        if (props.currentInstance?.opts?.query){
            Object.keys(props.currentInstance.opts.query).map((key) => {
                values.push({
                    name: key,
                    value: props.currentInstance.opts.query[key],
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
            query: {
                ...props.currentInstance.opts.query,
                [options["name"]]: options.value,
            },
        }));
    }

    const onEdit = (options: { name: string, value: string }, prevName: string) => {
        let query = props.currentInstance.opts.query;
        if (options.name !== prevName){
            delete query[prevName];
        }
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            query: {
                ...query,
                [options["name"]]: options.value,
            },
        }));
    }

    const onRemove = (name: string) => {
        let query = props.currentInstance.opts.query;
        delete query[name];
        dispatch(socketActions.setInstanceOpts({
            ...props.currentInstance.opts,
            query,
        }));
    }

    return (
        <div>
            <span className="text-white opacity-50 text-xs">
                URL Preview:
            </span>
            <Input
                className="mt-1 mb-3"
                value={value}
                disabled={true}
            />
            <span className="text-white opacity-50 text-xs">
                Queries:
            </span>
            {
                queries.map((query, i) =>
                    <QueryInput
                        key={`query-${i}`}
                        query={query}
                        onEdit={(value) => onEdit(value, query.name)}
                        onRemove={() => onRemove(query.name)}
                    />
                )
            }
            <QueryInput
                new={true}
                onSave={onSave}
            />
        </div>
    )
}
