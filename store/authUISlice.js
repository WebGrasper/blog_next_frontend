import { createSlice } from "@reduxjs/toolkit";

const authUISlice = createSlice({
  name: "authUI",
  initialState: {
    isModalOpen: false,
    view: "login", // 'login' | 'register' | 'forget' | 'otp'
    otpContext: "register", // 'register' | 'forget'
  },
  reducers: {
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.view = action.payload || "login";
    },
    closeModal: (state) => {
      state.isModalOpen = false;
    },
    setView: (state, action) => {
      state.view = action.payload;
    },
    setOTPContext: (state, action) => {
      state.otpContext = action.payload;
    }
  },
});

export const { openModal, closeModal, setView, setOTPContext } = authUISlice.actions;
export default authUISlice.reducer;
