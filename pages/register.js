import Head from "next/head";
import styles from "@/styles/login.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router"; // Import useRouter
import { register, resetRegisterState } from "@/store/registrationSlice";
import {
  confirmRegistration,
  resetConfirmRegisterState,
} from "@/store/confirmRegistrationSlice";

export default function Register() {
  const passwordMatchMessageRef = useRef(null);
  const register_state = useSelector((state) => state.register);
  const confirm_registration_state = useSelector(
    (state) => state.confirmRegistration
  );
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

  const handleRegistration = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data
    const { username, email, password, confirmPassword } = Object.fromEntries(
      formData.entries()
    ); // Convert FormData to plain object
    setDisabled(true);
    dispatch(register({ username, email, password }));
  };

  const [showOTPForm, setShowOTPForm] = useState(false);
  //Conditionally showing OTP form
  useEffect(() => {
    if (register_state?.data?.success) {
      dispatch(resetRegisterState());
      setShowOTPForm(true);
      enqueueSnackbar("OTP has been sent.", {
        autoHideDuration: 1000,
        variant: "success",
      });
    }
    setDisabled(false);
    if (!register_state?.data?.success && register_state?.data?.message){
      enqueueSnackbar(register_state?.data?.message, {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
  }, [register_state?.data]);

  const handleOTPVerification = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data
    const { OTP } = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    setDisabled(true);
    dispatch(confirmRegistration(OTP));
  };

  //Conditionally performing routing
  useEffect(() => {
    if (confirm_registration_state?.data?.success) {
      dispatch(resetConfirmRegisterState());
      setShowOTPForm(false);
      enqueueSnackbar("Registration successfull.", {
        autoHideDuration: 1000,
        variant: "success",
      });
      router.push("/login");
    }
    setDisabled(false);
    if (!confirm_registration_state?.data?.success && confirm_registration_state?.data?.message){
      enqueueSnackbar(confirm_registration_state?.data?.message, {
        autoHideDuration: 2000,
        variant: "error",
      });
    }
  }, [confirm_registration_state?.data]);

  return (
    <div>
      <Head>
        <title>Register: WebGrasper</title>
        <meta
          name="description"
          content="Register page to make a new profile."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Login: WebGrasper" />
        <meta
          property="og:description"
          content="Register page to make a new profile."
        />
        <link rel="canonical" href="https://webgrasper.vercel.app/register" />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      <section className={styles.heroContainer}>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginFormSubContainer}>
            {showOTPForm ? (
              <>
                <h1>OTP Verification</h1>
                <form
                  className={styles.formContainer}
                  onSubmit={handleOTPVerification}
                >
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="OTP">OTP</label>
                    <input
                      type="number"
                      name="OTP"
                      id="OTP"
                      size={6}
                      placeholder="Enter a six digit number."
                      title="Enter a six digit OTP to verify registration."
                      required
                    />
                  </div>
                  <button type="submit" disabled={markDisabled}>{markDisabled ? 'Processing...':'Verify'}</button>
                  <button type="reset" onClick={(e)=>{
                    e.preventDefault();
                    router.push('/');
                  }}>Cancel</button>
                </form>
              </>
            ) : (
              <>
                <h1>Register</h1>
                <form
                  className={styles.formContainer}
                  onSubmit={handleRegistration}
                >
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="username">Username</label>
                    <input
                      type="name"
                      name="username"
                      id="username"
                      placeholder="Ex. Mohammad, Ram, John, etc."
                      pattern="/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/"
                      required
                    />
                  </div>
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
                    <div
                      id="passwordMatchMessage"
                      className={styles.passwordMatchMessage}
                      ref={passwordMatchMessageRef}
                      style={{ color: "red" }}
                    ></div>
                  </div>
                  <button type="submit" disabled={markDisabled}>{markDisabled ? 'Please wait...' : 'Register'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
