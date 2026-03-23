import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'provider'
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers:{
    setAuth(state, action: PayloadAction<{user: User; token: string}>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearAuth(state){
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const {setAuth, clearAuth} = authSlice.actions;
export const authReducer = authSlice.reducer;