import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { json } from "@codemirror/lang-json";
import { tags as t } from "@lezer/highlight";
import colors from "tailwindcss/colors";
import formatTime from "../../utils/formatTime";
import MessageInterface, { MessageStatus } from "../../interfaces/MessageInterface";
import {EditorView} from "@codemirror/view";

interface Props {
    data: MessageInterface,
    index: number,
}

const myTheme = createTheme({
    theme: "dark",
    settings: {
        background: "#222",
        foreground: "#fff",
        selection: "#036dd626",
        selectionMatch: "#036dd626",
        lineHighlight: "#8a91991a",
        gutterBackground: "#222",
        gutterForeground: "#aaa",
    },
    styles: [
        { tag: t.string, color: "#FB8C00" },
        { tag: t.number, color: "#03A9F4" },
        { tag: t.bool, color: "#26A69A" },
        { tag: t.null, color: "#aaa" },
    ],
});

export default function SocketMessage(props: Props){

    const formattedTime = useMemo(() => {
        return formatTime(props.data.timestamp);
    },[]);

    const messageType = useMemo(() => {
        if (props.data.message === undefined){
            return null;
        }
        if (props.data.status === MessageStatus.WARNING){
            return null;
        }
        let value: string = typeof props.data.message;
        value = value[0].toUpperCase() + value.slice(1);
        return value;
    },[]);

    const backgroundColor = useMemo(() => {
        switch (props.data.status){
            case MessageStatus.WARNING:
                return colors.yellow[600] + "11";
            default:
                return undefined;
        }
    },[]);

    const objectViewer = (msg: object) => {
        try {
            const message = JSON.stringify(msg,null,2);
            return (
                <div className="overflow-hidden">
                    <CodeMirror
                        editable={false}
                        value={message}
                        theme={myTheme}
                        extensions={[
                            json(),
                            EditorView.lineWrapping,
                        ]}
                        basicSetup={{
                            lineNumbers: false,
                        }}
                    />
                </div>
            )
        } catch (e){
            return null;
        }
    }

    const message = useMemo(() => {
        switch (typeof props.data.message){
            case "object":
                if (props.data.message){
                    return objectViewer(props.data.message);
                }
                return "null";
            case "number":
            case "string":
                return props.data.message;
            default:
                return null;
        }
    },[]);

    return (
        <div
            key={`msg-${props.data.instanceId}-${props.data.timestamp}`}
            className="message px-4 py-1 font-mono"
            style={{ backgroundColor }}
        >
            <div className="flex">
                <div className="text-orange-300">
                    { props.data.type }
                </div>
                <div className="flex-1"/>
                <div className="opacity-60">
                    { formattedTime }
                </div>
            </div>
            {
                messageType ? (
                    <div className="break-all">
                        <span className="text-cyan-300">
                            { messageType + ": " }
                        </span>
                        <span>
                            { message }
                        </span>
                    </div>
                ) : message ? (
                    <span>
                        { message }
                    </span>
                ) : null
            }
        </div>
    )
}
