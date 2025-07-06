// Redux Toolkit
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ITranslate, TypeLanguage } from '../Domain/ILanguage';
import { AdapterLanguage } from './AdapterLanguage';
import { AdapterStorage } from './AdapterStorage';

const { language }: { language: TypeLanguage } = AdapterStorage.get(['language']);

const initialState: ITranslate = AdapterLanguage[language] ?? AdapterLanguage['en'];

const slice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (_, { payload }: PayloadAction<TypeLanguage>) => {
      AdapterStorage.set('language', payload);
      return {
        ...AdapterLanguage[payload],
      };
    },
  },
});

export const { setLanguage } = slice.actions;

export default slice.reducer;
