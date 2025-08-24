import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import sliceAuthInspireHub from './SliceAuthInspireHub';
import sliceGeneric from './SliceGeneric';
import sliceLanguage from './SliceLanguage';

export const AdapterStore = configureStore({
  reducer: {
    authInspireHub: sliceAuthInspireHub,
    generic: sliceGeneric,
    language: sliceLanguage,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});
export const useAppDispatch = () => useDispatch();
export type RootState = ReturnType<typeof AdapterStore.getState>;
export type AppDispatch = typeof AdapterStore.dispatch;
