import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/profile.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router"; // Import useRouter
import { profile, resetProfileState } from "@/store/profileSlice";
import { useCookies } from "react-cookie";
import { resetLoginState } from "@/store/loginSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const [isAdmin, setAdmin] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  
  const state = useSelector((state) => state.profile);

  const fetchData = () => {
      dispatch(profile(cookies.token));
  };
  useEffect(()=>{
    if(state?.data === null){
      fetchData();
    }
  },[state?.data]);

  useEffect(() => {
    if (state?.data?.user?.role === "admin") {
      setAdmin(true);
    }
  }, [state]);

  const handleLogout = () =>{
    removeCookie('token');
    dispatch(resetLoginState());
    dispatch(resetProfileState());
    router.push('/')
  }


  return (
    <div>
      <Head>
        <title>Profile: WebGrasper</title>
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
      <section className={styles.profile_supreme_container}>
        <div className={styles.profile_container}>
          <div className={styles.profile_image_container}>
            <img
              className={styles.profile_image}
              src={state?.data?.user?.avatar}
              alt=""
            />
          </div>
          <div className={styles.personal_details_container}>
            <div className={styles.name_container}>
              <p className={styles.profile_head2}>Name: </p>
              <p>{state?.data?.user?.username}</p>
            </div>
            <div className={styles.gmail_container}>
              <p className={styles.profile_head2}>Email: </p>
              <p>{state?.data?.user?.email}</p>
            </div>
            {isAdmin && (
              <div className={styles.admin_panel_container}>
                <Link className={styles.admin_panel_link} href={'#'}>[ Admin Panel ]</Link>
              </div>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </section>
    </div>
  );
}
