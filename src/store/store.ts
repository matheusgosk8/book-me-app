import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage padrão

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // só persiste o slice auth
};

const rootReducer = {
  auth: authReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { combineReducers } from 'redux';
