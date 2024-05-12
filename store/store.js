import { configureStore } from '@reduxjs/toolkit';
import loginSlice from './loginSlice';
import profileSlice from './profileSlice';
import registrationSlice from './registrationSlice';
import confirmRegistrationSlice from './confirmRegistrationSlice';
import forgetPassSlice from './forgetPassSlice';
import resetPassSlice from './resetPassSlice';

export default configureStore({
  reducer: {
    login: loginSlice,
    profile: profileSlice,
    register: registrationSlice,
    confirmRegistration: confirmRegistrationSlice,
    forgetPassword: forgetPassSlice,
    resetPassword: resetPassSlice,
  }
});