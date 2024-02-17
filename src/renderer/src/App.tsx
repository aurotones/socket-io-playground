import Sidebar from "./views/Sidebar";
import MainScreen from "./views/MainScreen";

function App(){
    return (
        <div className="w-full h-full flex">
            <Sidebar/>
            <MainScreen/>
        </div>
    )
}

export default App;
