// import { configureStore } from "@reduxjs/toolkit";
// import persistStore from "redux-persist/es/persistStore";
// import { rootReducer } from "./rootReducer";
// import storage from "redux-persist/lib/storage";
// import persistReducer from "redux-persist/es/persistReducer";
// import userAccountReducer from './features/userAccount';
// const persistConfig = {
//   key: "root",
//   storage,
// };
// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
//   accountmanage: userAccountReducer,
// });

// export const persistor = persistStore(store);

// store.js
import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import { combineReducers } from "redux"; 
import userAccountReducer from './features/userAccount'; 
import fastfoodcardReducer from './features/fastfoodCart';
//import storage from "redux-persist/lib/storage"; 
const persistConfig = {
    key: "root",
    storage,
    // Whitelist chỉ tên slice là 'account'
    whitelist: ['account'], 
};

// TẠO ROOT REDUCER (Phải khớp với tên Slice là 'account')
const rootReducer = combineReducers({
    account: userAccountReducer, 
    fastfoodcard: fastfoodcardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer, 
    // Bắt buộc phải có middleware
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);