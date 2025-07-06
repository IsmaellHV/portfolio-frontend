import { combineReducers, legacy_createStore as createStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import sliceAuthInspireHub from './SliceAuthInspireHub';
import sliceGeneric from './SliceGeneric';
import sliceLanguage from './SliceLanguage';

const rootReducer = combineReducers({
  authInspireHub: sliceAuthInspireHub,
  generic: sliceGeneric,
  language: sliceLanguage,
});

export const AdapterStore = createStore(rootReducer);
export const useAppDispatch = () => useDispatch();
export type RootState = ReturnType<typeof rootReducer>;
