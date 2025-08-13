import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utilities/api";

// ---- Thunks -------------------------------------------------------------

// Called once at app start to discover if we're already logged in via cookie
export const loadSession = createAsyncThunk("auth/loadSession", async (_, thunkAPI) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.user; // { ...user }
  } catch (err) {
    // 401/403 means not logged in; treat as null user
    return thunkAPI.rejectWithValue(err.response?.data?.message || "No session");
  }
});

// Login with email/password (from your Login form)
export const loginThunk = createAsyncThunk("auth/login", async ({ email, password }, thunkAPI) => {
  try {
    const { data } = await api.post("/auth/login", { email, password });
    return data.user; // { ...user }
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

// Logout
export const logoutThunk = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await api.post("/auth/logout");
    return true;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

// ---- Slice --------------------------------------------------------------

const initialState = {
  isInitialized: false,  // we’ve tried loadSession
  isLoggedIn: false,
  user: null,
  status: "idle",        // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}, // (we rely on thunks)
  extraReducers: (builder) => {
    builder
      // loadSession
      .addCase(loadSession.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isInitialized = true;
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.status = "failed";
        state.isInitialized = true;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || "No active session";
      })
      // loginThunk
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isLoggedIn = true;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload || "Login failed";
      })
      // logoutThunk
      .addCase(logoutThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.status = "succeeded";
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Logout failed";
      });
  },
});

export default authSlice.reducer;

// ---- Selectors ----------------------------------------------------------

export const selectAuth = (state) => state.auth;
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;
export const selectUser = (state) => state.auth.user;
export const selectAuthInitialized = (state) => state.auth.isInitialized;
