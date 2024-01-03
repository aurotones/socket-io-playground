import {useMemo, useState} from "react";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

interface Props {
    query?: {
        name: string,
        value: string,
    },
    new?: boolean,
    onSave?: (query: { name: string, value: string }) => void,
    onEdit?: (query: { name: string, value: string }) => void,
    onRemove?: () => void,
}

export default function QueryInput(props: Props){
    const [name, setName] = useState(props.query?.name || "");
    const [value, setValue] = useState(props.query?.value || "");

    const disableButton = useMemo(() => {
        if (name.length === 0){
            return true
        }
        if (!props.new){
            let hasChanges = false;
            if (props.query?.name !== name){
                hasChanges = true;
            }
            if (props.query?.value !== value){
                hasChanges = true;
            }
            return !hasChanges;
        }
        return false;
    },[
        name,
        value,
        props.new,
        props.query,
    ]);

    const save = () => {
        props.onSave({
            name,
            value: value.length === 0 ? null : value,
        });
        setName("");
        setValue("");
    }

    const edit = () => {
        props.onEdit({
            name,
            value: value.length === 0 ? null : value,
        });
    }

    return (
        <div>
            <div className="flex mt-1 mb-3">
                <Input
                    value={name}
                    placeholder="Name"
                    onChangeText={setName}
                />
                <div className="w-3"/>
                <Input
                    value={value}
                    placeholder="Value"
                    onChangeText={setValue}
                />
                <div className="w-3"/>
                <Button
                    disabled={disableButton}
                    className="bg-blue-600"
                    onClick={props.new ? save : edit}
                >
                    { props.new ? "Save" : "Edit" }
                </Button>
                {
                    props.new ? null : (
                        <>
                            <div className="w-3"/>
                            <Button
                                className="bg-red-600"
                                onClick={props.onRemove}
                            >
                                Remove
                            </Button>
                        </>
                    )
                }
            </div>
        </div>
    )
}
