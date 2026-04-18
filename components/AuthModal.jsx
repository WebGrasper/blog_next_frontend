import styles from "./AuthModal.module.css";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { X, LogIn, UserPlus, Key, Mail } from "lucide-react";
import Spinner from "./spinner";
import { closeModal, setView, setOTPContext } from "@/store/authUISlice";
import { login as loginAction, resetLoginState } from "@/store/loginSlice";
import { register as registerAction, resetRegisterState } from "@/store/registrationSlice";
import { confirmRegistration, resetConfirmRegisterState } from "@/store/confirmRegistrationSlice";
import { forgetPassword as forgetAction, resetFPState } from "@/store/forgetPassSlice";
import { resetPassword, resetRPState } from "@/store/resetPassSlice";
import { profile } from "@/store/profileSlice";
import { useRouter } from "next/router";

const AuthModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie] = useCookies(["token", "username", "avatar"]);
  const passwordMatchMessageRef = useRef(null);

  // Redux States
  const { isModalOpen, view, otpContext } = useSelector((state) => state.authUI);
  const loginState = useSelector((state) => state.login);
  const registerState = useSelector((state) => state.register);
  const confirmRegState = useSelector((state) => state.confirmRegistration);
  const forgetState = useSelector((state) => state.forgetPassword);
  const resetPassState = useSelector((state) => state.resetPassword);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});


  // --- Handlers ---

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData.entries());
    setIsSubmitting(true);
    await dispatch(loginAction({ email, password }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password, confirmPassword } = Object.fromEntries(formData.entries());

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    dispatch(registerAction({ username, email, password }));
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    const { email } = Object.fromEntries(new FormData(e.target).entries());
    setIsSubmitting(true);
    dispatch(forgetAction(email));
  };

  const handleOTPVerify = async (e) => {
    e.preventDefault();
    const { otp, password, confirmPassword } = Object.fromEntries(new FormData(e.target).entries());
    setIsSubmitting(true);

    if (otpContext === 'register') {
      dispatch(confirmRegistration(otp));
    } else {
      dispatch(resetPassword({ otp, password, confirmPassword }));
    }
  };

  // --- Side Effects (Success/Error Handling) ---

  // Login Success/Error
  useEffect(() => {
    if (loginState?.isError) {
      enqueueSnackbar(loginState?.data?.message || "Login failed", { variant: "error" });
      setIsSubmitting(false);
      dispatch(resetLoginState());
    }
    if (loginState?.data?.success) {
      setCookie("token", loginState.data.token, { path: '/' });
      setCookie("username", loginState.data.user.username, { path: '/' });
      setCookie("avatar", loginState.data.user.avatar, { path: '/' });
      dispatch(profile(loginState.data.token));
      dispatch(closeModal());
      dispatch(resetLoginState());
      setIsSubmitting(false);
    }
  }, [loginState]);

  // Register Success -> Show OTP
  useEffect(() => {
    if (registerState?.data?.success) {
      dispatch(setOTPContext('register'));
      dispatch(setView('otp'));
      enqueueSnackbar("OTP sent to your email", { variant: "success" });
      setIsSubmitting(false);
      dispatch(resetRegisterState());
    } else if (registerState?.isError || (!registerState?.data?.success && registerState?.data?.message)) {
      enqueueSnackbar(registerState?.data?.message || "Registration failed", { variant: "error" });
      setIsSubmitting(false);
      dispatch(resetRegisterState());
    }
  }, [registerState]);

  // Forget Password Success -> Show OTP/Reset
  useEffect(() => {
    if (forgetState?.data?.success) {
      dispatch(setOTPContext('forget'));
      dispatch(setView('otp'));
      enqueueSnackbar("Reset code sent", { variant: "success" });
      setIsSubmitting(false);
      dispatch(resetFPState());
    } else if (forgetState?.isError) {
      enqueueSnackbar(forgetState?.data?.message || "Error processing request", { variant: "error" });
      setIsSubmitting(false);
      dispatch(resetFPState());
    }
  }, [forgetState]);

  // Confirm Registration Success
  useEffect(() => {
    if (confirmRegState?.data?.success) {
      enqueueSnackbar("Registration successful! Please login.", { variant: "success" });
      dispatch(setView('login'));
      setIsSubmitting(false);
      dispatch(resetConfirmRegisterState());
    } else if (confirmRegState?.isError) {
      enqueueSnackbar(confirmRegState?.data?.message || "Invalid OTP", { variant: "error" });
      setIsSubmitting(false);
      dispatch(resetConfirmRegisterState());
    }
  }, [confirmRegState]);

  // Reset Password Success
  useEffect(() => {
    if (resetPassState?.data?.success) {
      enqueueSnackbar("Password reset successful!", { variant: "success" });
      dispatch(setView('login'));
      setIsSubmitting(false);
      dispatch(resetRPState());
    } else if (resetPassState?.isError) {
      enqueueSnackbar(resetPassState?.data?.message || "Reset failed", { variant: "error" });
      setIsSubmitting(false);
      dispatch(resetRPState());
    }
  }, [resetPassState]);

  // --- Render Helpers ---

  const renderHeader = () => {
    switch (view) {
      case 'register': return { title: 'Create account', subtitle: 'Join WebGrasper to share your stories.' };
      case 'forget': return { title: 'Reset password', subtitle: 'Enter your email to receive a reset code.' };
      case 'otp': return { title: 'Final step', subtitle: 'Check your email for the verification code.' };
      default: return { title: 'Welcome back.', subtitle: 'Log in to your account to continue.' };
    }
  };

  const header = renderHeader();

  if (!isModalOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => dispatch(closeModal())}
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: 'rgba(255, 255, 255, 0.15)'
      }}
    >
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => dispatch(closeModal())}>
          <X size={24} />
        </button>

        <div className={styles.modalHeader}>
          <h1>{header.title}</h1>
          <p>{header.subtitle}</p>
        </div>

        {view === 'login' && (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Sign in"}
            </button>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.textLink} onClick={() => dispatch(setView('forget'))}>
                Forgot password?
              </button>
              <span>
                No account? <button type="button" className={styles.textLink} onClick={() => dispatch(setView('register'))}>Create one</button>
              </span>
            </div>
          </form>
        )}

        {view === 'register' && (
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <label>Username</label>
              <input type="text" name="username" placeholder="Username" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" name="password" placeholder="Min. 8 characters" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Match password" required />
              {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Create account"}
            </button>
            <div className={styles.modalFooter}>
              <span>
                Already have an account? <button type="button" className={styles.textLink} onClick={() => dispatch(setView('login'))}>Sign in</button>
              </span>
            </div>
          </form>
        )}

        {view === 'forget' && (
          <form className={styles.form} onSubmit={handleForgetPassword}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" placeholder="you@example.com" required />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Send reset code"}
            </button>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.textLink} onClick={() => dispatch(setView('login'))}>
                Back to sign in
              </button>
            </div>
          </form>
        )}

        {view === 'otp' && (
          <form className={styles.form} onSubmit={handleOTPVerify}>
            <div className={styles.inputGroup}>
              <label>Verification Code</label>
              <input type="number" name="otp" placeholder="6-digit code" required />
            </div>
            {otpContext === 'forget' && (
              <>
                <div className={styles.inputGroup}>
                  <label>New Password</label>
                  <input type="password" name="password" placeholder="New password" required />
                </div>
                <div className={styles.inputGroup}>
                  <label>Confirm New Password</label>
                  <input type="password" name="confirmPassword" placeholder="Match new password" required />
                </div>
              </>
            )}
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Verify & Complete"}
            </button>
            <div className={styles.modalFooter}>
              <button type="button" className={styles.textLink} onClick={() => dispatch(setView('login'))}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
