import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';
import profileSlice from './profileSlice';
import logoutSlice, { logout } from './logoutSlice';

export default configureStore({
  reducer: {
    login: loginSlice,
    profile: profileSlice,
    logout: logoutSlice,
  }
});