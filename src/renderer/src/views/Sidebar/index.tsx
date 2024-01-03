import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import MainState from "../../interfaces/reducers/MainState";
import InstanceItem from "./InstanceItem";
import socketActions from "../../actions/socketActions";
import Button from "../../components/Button";
import "./Sidebar.scss";

export default function Sidebar(){
    const dispatch = useDispatch();
    const main: MainState = useSelector((state: RootState) => state.main);

    const createInstance = () => {
        dispatch(socketActions.createInstance());
    }

    return (
        <div className="sidebar flex flex-col select-none">
            <div className="p-4">
                <Button className="bg-blue-700" onClick={createInstance}>
                    Create instance
                </Button>
            </div>
            <div className="liner"/>
            <div
                className="px-4 py-2 flex-1"
                style={{
                    height: 0,
                    overflowY: "auto",
                }}
            >
                <span className="text-white opacity-50 text-xs">
                    Instances:
                </span>
                {
                    main.instances.map((instance, i) =>
                        <InstanceItem
                            key={`socket-${instance.id}`}
                            active={main.activeInstance === i}
                            instance={instance}
                            index={i}
                        />
                    )
                }
            </div>
        </div>
    )
}
