import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  uid: string | null;
  name: string | null;
  email: string | null;
}

const initialState: UserState = {
  uid: null,
  name: null,
  email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action: PayloadAction<UserState>) {
      state.uid = action.payload.uid;
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    logout(state) {
      state.uid = null;
      state.name = null;
      state.email = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
