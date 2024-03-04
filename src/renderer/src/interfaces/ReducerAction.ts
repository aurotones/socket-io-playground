import { Action } from "@reduxjs/toolkit";

interface ReducerAction extends Action {
    payload: any,
}

export default ReducerAction;
