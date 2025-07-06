import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@supabase/supabase-js';

interface ISlice {
  auth: boolean;
  user: User | null;
}

const initialState: ISlice = {
  auth: false,
  user: null,
};

const slice = createSlice({
  name: 'authInspireHub',
  initialState,
  reducers: {
    signIn: (state, { payload }: PayloadAction<{ user: User | null }>) => {
      return {
        ...state,
        auth: true,
        user: payload.user,
      };
    },
    signOut: (state) => {
      return {
        ...state,
        auth: false,
        user: null,
      };
    },
    setUser: (state, { payload }: PayloadAction<{ user: User | null }>) => {
      return {
        ...state,
        auth: !!payload?.user,
        user: payload.user,
      };
    },
  },
});

export const { signIn, signOut, setUser } = slice.actions;

export default slice.reducer;
