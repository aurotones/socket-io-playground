import { combineReducers, configureStore } from "@reduxjs/toolkit";

import main from "./reducers/main";

const reducers = combineReducers({
    main,
});

export const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
