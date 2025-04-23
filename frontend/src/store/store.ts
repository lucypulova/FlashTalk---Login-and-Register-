import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // използва localStorage

import roomsReducer from '@/store/roomsSlice';
import foundMessagesReducer from '@/store/fondedMessagesSlice';
import authReducer from '@/store/authSlice';

// Комбиниране на редюсърите
const rootReducer = combineReducers({
  roomsData: roomsReducer,
  foundMessagesData: foundMessagesReducer,
  auth: authReducer
});

// Конфигурация на persist (само auth пазим)
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // пазим само auth slice
};

// Обвиване с persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Конфигурация на store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
});

// Типизация
export type RootState = ReturnType<typeof store.getState>;
export type Dispatch = typeof store.dispatch;

// Експорт
export const persistor = persistStore(store);
export default store;
