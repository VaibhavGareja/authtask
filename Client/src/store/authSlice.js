import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signup, login } from "./api";

const initialState = {
  user: null,
  isAuthenticated: false,
  email: null,
  token: [],
  usreTokon: [],
};

export const signupUser = createAsyncThunk("auth/signup", async (userData) => {
  const response = await signup(userData);
  return response.data;
});

export const loginUser = createAsyncThunk("auth/login", async (userData) => {
  const response = await login(userData);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.email = action.payload.email;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.email = action.payload.email;
        state.token = action.payload.token;
        state.usreTokon = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
