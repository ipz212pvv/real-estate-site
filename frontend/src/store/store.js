import { configureStore } from '@reduxjs/toolkit'
import { api } from "@/store/services/api.js";
import authReducer from "./slices/authSlice.js";
import savedAdvertsReducer from "./slices/savedAdvertsSlice.js";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['savedAdverts'],
};

const rootReducer = combineReducers({
  auth: authReducer,
  savedAdverts: savedAdvertsReducer,
  [api.reducerPath]: api.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(api.middleware),
})

export const persistor = persistStore(store);
