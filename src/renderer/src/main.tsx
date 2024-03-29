import React from "react";
import { Provider } from "react-redux";
import Modal from "react-modal";
import ReactDOM from "react-dom/client";
import App from "./App";
import { store } from "./store";
import "./styles.scss";

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>
)
