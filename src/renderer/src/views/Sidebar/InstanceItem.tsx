import {useMemo, useState} from "react";
import Ink from "react-ink";
import Modal from "react-modal";
import { Trash2 } from "react-feather";
import { useDispatch } from "react-redux";
import colors from "tailwindcss/colors";
import InstanceInterface, { InstanceStatus } from "../../interfaces/InstanceInterface";
import socketActions from "../../actions/socketActions";
import Button from "../../components/Button";
import socket from "../../socket";

interface Props {
    instance: InstanceInterface,
    active: boolean,
    index: number,
}

export default function InstanceItem(props: Props){
    const [removeModal, setRemoveModal] = useState(false);
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

    const statusColor = useMemo<any>(() => {
        switch (props.instance.status){
            case InstanceStatus.CONNECTING:
                return colors.sky[600];
            case InstanceStatus.CONNECTED:
                return colors.green[600];
            case InstanceStatus.ERROR:
                return colors.red[600];
            default:
                return "#555";
        }
    },[
        props.instance.status,
        props.active,
    ]);

    const cancel = () => {
        setRemoveModal(false);
    }

    const onClick = () => {
        dispatch(socketActions.changeActiveInstance(props.index));
    }

    const removeInstance = () => {
        setRemoveModal(true);
    }

    const removeConfirm = () => {
        switch (props.instance.status){
            case InstanceStatus.CONNECTING:
            case InstanceStatus.CONNECTED:
                socket.disconnect(props.instance.id, InstanceStatus.IDLE);
                break;
        }
        dispatch(socketActions.removeInstance(props.instance.id));
    }

    return (
        <div
            className="instance relative my-1 px-4 py-2 text-sm cursor-pointer"
            style={{ background: props.active ? "#2D2D2D" : "transparent" }}
            onClick={onClick}
        >
            <div
                className="status"
                style={{
                    background: statusColor,
                }}
            />
            <span style={{ fontSize: 13 }}>
                { formatName }
            </span>
            <Ink/>
            <div className="actions" onClick={removeInstance}>
                <Trash2 color="#ff5555" size={14}/>
            </div>
            <Modal
                isOpen={removeModal}
                onRequestClose={cancel}
                className="Modal"
                overlayClassName="Overlay"
            >
                <div className="p-5 text-sm">
                    <div>
                        Are you sure you want to delete this instance?
                    </div>
                    <div className="mt-5 flex">
                        <div className="flex-1"/>
                        <Button
                            onClick={cancel}
                        >
                            Cancel
                        </Button>
                        <div className="w-2"/>
                        <Button
                            onClick={removeConfirm}
                            style={{ backgroundColor: "red" }}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
