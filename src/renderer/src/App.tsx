import Sidebar from "./components/Sidebar";
import MainScreen from "./screens/MainScreen";

function App(){
    return (
        <div className="w-full h-full flex">
            <Sidebar/>
            <MainScreen/>
        </div>
    )
}

export default App;
