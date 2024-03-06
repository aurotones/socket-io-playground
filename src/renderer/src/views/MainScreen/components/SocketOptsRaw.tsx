import MD5 from "crypto-js/md5";
import {useEffect, useMemo, useRef, useState} from "react";
import { useDispatch } from "react-redux";
import { linter } from "@codemirror/lint";
import { EditorView } from "@codemirror/view";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import InstanceInterface from "../../../interfaces/InstanceInterface";
import Button from "../../../components/Button";
import socketActions from "../../../actions/socketActions";

interface Props {
    currentInstance: InstanceInterface,
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
        { tag: t.string, color: "#FB8C00", fontSize: 13 },
        { tag: t.number, color: "#03A9F4", fontSize: 13 },
        { tag: t.bool, color: "#26A69A", fontSize: 13 },
        { tag: t.null, color: "#aaa", fontSize: 13 },
    ],
});

export default function SocketOptsRaw(props: Props){
    const dispatch = useDispatch();
    const linterExtension = useRef(linter(jsonParseLinter())).current;
    const [initValueHash, setInitValueHash] = useState("{}");
    const [options, setOptions] = useState("{}");

    useEffect(() => {
        if (props.currentInstance){
            const value = JSON.stringify(props.currentInstance?.opts,null,2);
            setOptions(value);
            setInitValueHash(MD5(value).toString());
        }
    },[]);

    const hasChanges = useMemo(() => {
        return initValueHash !== MD5(options).toString()
    },[
        initValueHash,
        options,
    ])

    const checkValue = () => {
        try {
            return JSON.parse(options);
        } catch (e){
            if (e instanceof Error){
                alert(e.message);
            }
            return null
        }
    }

    const save = () => {
        const lintedOptions = checkValue();
        if (lintedOptions){
            console.log("Linted value:", lintedOptions);
            dispatch(socketActions.setInstanceOpts({
                ...lintedOptions,
            }));
        }
    }

    const copyOptions = async () => {
        const lintedOptions = checkValue();
        if (lintedOptions){
            await navigator.clipboard.writeText(options);
        }
    }

    return (
        <div>
            <span className="text-white opacity-50 text-xs">
                Options (JSON):
            </span>
            <div>
                <CodeMirror
                    className="mt-1 overflow-hidden"
                    style={{
                        border: "1px solid #333",
                    }}
                    editable={true}
                    value={options}
                    onChange={(value) => setOptions(value)}
                    theme={myTheme}
                    extensions={[
                        json(),
                        linterExtension,
                        EditorView.lineWrapping,
                    ]}
                    basicSetup={{
                        lineNumbers: true,
                    }}
                />
                <div className="h-5"/>
                <div className="flex">
                    <Button
                        className="bg-blue-600"
                        onClick={copyOptions}
                    >
                        Copy to clipboard
                    </Button>
                    <div className="flex-1"/>
                    <Button
                        disabled={!hasChanges}
                        className="bg-blue-600"
                        onClick={save}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}
