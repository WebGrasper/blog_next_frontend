import Head from "next/head";
import styles from "@/styles/login.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router"; // Import useRouter
import { forgetPassword, resetFPState } from "@/store/forgetPassSlice";
import { resetPassword, resetRPState } from "@/store/resetPassSlice";
import Spinner from "@/components/spinner";

export default function ForgetPassword() {
  const passwordMatchMessageRef = useRef(null);
  const forget_password_state = useSelector((state) => state.forgetPassword);
  const reset_password_state = useSelector((state) => state.resetPassword);
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [markDisabled, setDisabled] = useState(false);

  function check(event) {
    const confirmPassword = event.target.value;
    const password = document.getElementById("password").value;
    const passwordMatchMessage = passwordMatchMessageRef.current; // Access ref here

    if (confirmPassword !== password) {
      event.target.setCustomValidity("Passwords must match.");
      passwordMatchMessage.innerHTML = "Passwords do not match.";
    } else {
      event.target.setCustomValidity("");
      passwordMatchMessage.innerHTML = "";
    }
  }

  const handleFP = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data
    const { email } = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    setDisabled(true);
    dispatch(forgetPassword(email));
  };

  const [showOTPForm, setShowOTPForm] = useState(false);
  //Conditionally showing OTP form
  useEffect(() => {
    if (forget_password_state?.data?.success) {
      setShowOTPForm(true);
      enqueueSnackbar("OTP has been sent.", {
        autoHideDuration: 1000,
        variant: "success",
      });
    }
    setDisabled(false);
    if (
      !forget_password_state?.data?.success &&
      forget_password_state?.data?.message
    ) {
      enqueueSnackbar(forget_password_state?.data?.message, {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
    dispatch(resetFPState());
  }, [forget_password_state?.data]);

  const handleOTPVerification = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data
    const { otp, password, confirmPassword } = Object.fromEntries(
      formData.entries()
    ); // Convert FormData to plain object
    setDisabled(true);
    dispatch(resetPassword({ otp, password, confirmPassword }));
  };

  //Conditionally performing routing
  useEffect(() => {
    if (reset_password_state?.data?.success) {
      setShowOTPForm(false);
      enqueueSnackbar("Password reset successfully.", {
        autoHideDuration: 1000,
        variant: "success",
      });
      router.push("/login");
    }
    setDisabled(false);
    if (
      !reset_password_state?.data?.success &&
      reset_password_state?.data?.message
    ) {
      enqueueSnackbar(reset_password_state?.data?.message, {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
    dispatch(resetRPState());
  }, [reset_password_state?.data]);

  return (
    <div>
      <Head>
        <title>Forget Password: WebGrasper</title>
        <meta
          name="description"
          content="Reset your password in case if you've not remeber."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Login: WebGrasper" />
        <meta
          property="og:description"
          content="Reset your password in case if you've not remeber."
        />
        <link rel="canonical" href="https://webgrasper.vercel.app/login" />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      <section className={styles.heroContainer}>
          <div className={styles.loginFormSubContainer}>
            {showOTPForm ? (
              <>
                <h1>OTP Verification</h1>
                <form
                  className={styles.formContainer}
                  onSubmit={handleOTPVerification}
                >
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="otp">OTP</label>
                    <input
                      type="number"
                      name="otp"
                      id="otp"
                      size={6}
                      placeholder="Enter a six digit number."
                      title="Enter a six digit OTP to verify registration."
                      required
                    />
                  </div>
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,1024}$"
                      title="The password should be minimum of 8 characters, which consist atleast one Upper, one Lower case alphabet, one number and one special character[!@#$%^&*]."
                      required
                    />
                  </div>
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder="Re-enter your password"
                      pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,1024}$"
                      title="The password should be minimum of 8 characters, which consist atleast one Upper, one Lower case alphabet, one number and one special character[!@#$%^&*]."
                      required
                      onInput={check}
                    />
                  </div>
                  <div
                    id="passwordMatchMessage"
                    className={styles.passwordMatchMessage}
                    ref={passwordMatchMessageRef}
                    style={{ color: "red" }}
                  ></div>
                  <button type="submit" disabled={markDisabled}>
                    {markDisabled ? <Spinner/> : "Verify"}
                  </button>
                  <button
                    type="reset"
                    disabled={markDisabled}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(resetFPState());
                      dispatch(resetRPState());
                      router.push("/");
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1>Forget Password</h1>
                <form className={styles.formContainer} onSubmit={handleFP}>
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="Email">Email</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Ex. abc@gmail.com"
                      pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
                      required
                    />
                  </div>
                  <button type="submit" disabled={markDisabled}>
                    {markDisabled ? <Spinner/> : "Submit"}
                  </button>
                  <button
                    type="button"
                    disabled={markDisabled}
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(resetFPState());
                      router.push("/login");
                    }}
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
      </section>
    </div>
  );
}
