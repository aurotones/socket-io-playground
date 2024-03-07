import { useEffect } from "react";
import { autoUpdater } from "electron-updater";
import Sidebar from "./views/Sidebar";
import MainScreen from "./views/MainScreen";

function App(){
    useEffect(() => {
        autoUpdater.checkForUpdatesAndNotify().then((info) => {
            console.log(info);
        });
    },[]);

    return (
        <div className="w-full h-full flex">
            <Sidebar/>
            <MainScreen/>
        </div>
    )
}

export default App;
