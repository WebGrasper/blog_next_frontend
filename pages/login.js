import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/login.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/loginSlice";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router"; // Import useRouter
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

export default function Login() {
  const [loginForm, setLoginForm] = useState(true);
  const passwordMatchMessageRef = useRef(null); // Define the ref here
  const state = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);

  const handleChange = () => {
    setLoginForm((prev) => !prev);
  };

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

  const loginFormHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data
    const { email, password } = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    await dispatch(login({ email, password }));
  };

  // Conditional checking(Started)
  useEffect(() => {
    if (state && state?.isError) {
      enqueueSnackbar(state?.data?.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [state]);

  useEffect(() => {
    if (state && state?.data?.success) {
      let token = state?.data?.token;
      setCookie("token", token, {
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      });
      router.push("/profile");
    }
  }, [state, state?.data, router]);

  useEffect(() => {
    if (Cookies.get("token")) {
      router.push("/profile");
    }
  }, [Cookies]);

  return (
    <div>
      <Head>
        <title>Login: WebGrasper</title>
        <meta
          name="description"
          content="Login page to access profile. If profile not existing then create new one!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Login: WebGrasper" />
        <meta
          property="og:description"
          content="Login page to access profile. If profile not existing then create new one!"
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
        <div className={styles.loginWallpaperContainer}>
          <Image
            src="https://ik.imagekit.io/94nzrpaat/images/loginWallpaper.jpg?updatedAt=1714299849982"
            alt="Login page wallpaper: WebGrasper"
            width={100}
            height={100}
            loading="lazy"
            unoptimized
          />
        </div>
        <div className={styles.loginFormContainer}>
          <div className={styles.loginFormSubContainer}>
            {loginForm ? (
              <>
                <h1>Login</h1>
                <form
                  className={styles.formContainer}
                  onSubmit={loginFormHandler}
                >
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
                    <label htmlFor="Email">Password</label>
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
                  <Link href="#" className={styles.forgetPasswordLink}>
                    Forget password?
                  </Link>
                  <button type="submit">Login</button>
                  <button type="button" onClick={handleChange}>
                    Create account
                  </button>
                </form>
              </>
            ) : (
              <>
                <h1>Register</h1>
                <form className={styles.formContainer}>
                  <div className={styles.inputFieldContainer}>
                    <label htmlFor="Username">Username</label>
                    <input
                      type="name"
                      name="Username"
                      id="Username"
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
                  <button type="submit">Register</button>
                  <button type="button" onClick={handleChange}>
                    Login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
