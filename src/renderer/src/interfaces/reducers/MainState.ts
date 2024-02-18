import InstanceInterface from "../InstanceInterface";

interface MainState {
    instances: InstanceInterface[],
    activeInstance: number,
}

export default MainState;
