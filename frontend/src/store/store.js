import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // (Optional) devTools: process.env.NODE_ENV !== 'production'
});

export default store;
