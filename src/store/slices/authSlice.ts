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
      // Salva no localStorage
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('token', action.payload.token);
    },
    clearAuth(state) {
      state.userId = null;
      state.token = null;
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
    },
    loadAuth(state) {
      state.userId = localStorage.getItem('userId');
      state.token = localStorage.getItem('token');
    },
  },
});

export const { setAuth, clearAuth, loadAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
