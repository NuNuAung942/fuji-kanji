import { configureStore } from '@reduxjs/toolkit';
import kanjiReducer from '../features/kanji/kanjiSlice';

export const store = configureStore({
  reducer: {
    kanji: kanjiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;