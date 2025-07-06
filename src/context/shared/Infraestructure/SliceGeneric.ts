import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ENVIRONMENT } from '../../../env';
import { AdapterIndexedDB } from './AdapterIndexedDB';
import { AdapterStorage } from './AdapterStorage';
const { themeLight } = AdapterStorage.get(['themeLight']);
interface ISlice {
  dbLocal: AdapterIndexedDB;
  loadingApp: boolean;
  loading: boolean;
  textLoading: string;
  themeLight: boolean;
}

const initialState: ISlice = {
  dbLocal: new AdapterIndexedDB(`db_${ENVIRONMENT.APP.SYSTEM}_${ENVIRONMENT.APP.VERSION_MAJOR}`, Number(ENVIRONMENT.INDEXEDDB.VERSION) || 1, [{ name: 'list', pk: '_id', index: [], encrpyt: false }]),
  loadingApp: false,
  loading: false,
  textLoading: '',
  themeLight: typeof themeLight === 'boolean' ? themeLight : false,
};

// initialState.dbLocal.run();

const slice = createSlice({
  name: 'generic',
  initialState,
  reducers: {
    addLoading: (state, { payload }: PayloadAction<string>) => {
      return {
        ...state,
        loading: true,
        textLoading: payload,
      };
    },
    removeLoading: (state) => {
      return {
        ...state,
        loading: false,
        textLoading: '',
      };
    },
    setToggleTheme: (state, { payload }: PayloadAction<boolean>) => {
      AdapterStorage.set('themeLight', payload);
      return {
        ...state,
        themeLight: payload,
      };
    },
  },
});

export const { addLoading, removeLoading, setToggleTheme } = slice.actions;

export default slice.reducer;
