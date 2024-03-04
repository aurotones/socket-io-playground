import { combineReducers, configureStore } from "@reduxjs/toolkit";

import main from "./reducers/main";
import messages from "./reducers/messages";

const reducers = combineReducers({
    main,
    messages,
});

export const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
