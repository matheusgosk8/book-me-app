import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  userId: null,
  token: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ userId: string; token: string }>) {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    clearAuth(state) {
      state.userId = null;
      state.token = null;
    },
    // Persist/rehydration is handled by redux-persist + PersistGate elsewhere in the app
  },
});
export const { setAuth, clearAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
