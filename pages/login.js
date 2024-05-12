import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/login.module.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/store/loginSlice";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router"; // Import useRouter
import Cookies from "js-cookie";
import { useCookies } from "react-cookie";

export default function Login() {
  const state = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const router = useRouter(); // Initialize useRouter
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [markDisabled, setDisabled] = useState(false);

  const loginFormHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target); // Get form data
    const { email, password } = Object.fromEntries(formData.entries()); // Convert FormData to plain object
    setDisabled(true);
    await dispatch(login({ email, password }));
  };

  // Conditional checking(Started)
  useEffect(() => {
    if (state && state?.isError) {
      enqueueSnackbar(state?.data?.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
      setDisabled(false);
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
        <div className={styles.loginFormContainer}>
        <div className={styles.loginFormSubContainer}>
          <h1>Login</h1>
          <form className={styles.formContainer} onSubmit={loginFormHandler}>
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
            <Link href="/forgetPassword" className={styles.forgetPasswordLink}>
              Forget password?
            </Link>
            <button type="submit" disabled={markDisabled}>{markDisabled ? 'Logging in...' : 'Login'}</button>
            <button type="button" disabled={markDisabled} onClick={(e)=>{
              e.preventDefault();
              router.push('/register');
            }}>Create account</button>
          </form>
        </div>
        </div>
      </section>
    </div>
  );
}
