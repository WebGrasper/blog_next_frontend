import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/profile.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import { useRouter } from "next/router"; // Import useRouter
import { profile } from "@/store/profileSlice";
import { logout, resetLogoutState } from "@/store/logoutSlice";
import { useCookies } from "react-cookie";
import { resetLoginState } from "@/store/loginSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const [isAdmin, setAdmin] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["jwtInCookie"]);
  
  const state = useSelector((state) => state.profile);
  const logout_state = useSelector((state)=>state.logout);

  const fetchData = async () => {
    await dispatch(profile(cookies.token));
  };
  useEffect(()=>{
    if(cookies.token){
      fetchData();
    }
  },[]);

  useEffect(() => {
    if (state?.data?.user?.role === "admin") {
      setAdmin(true);
    }
  }, [state]);

  // useEffect(()=>{
  //   if(!Cookies.get('token') || (Cookies.get('token') && state?.isError)){
  //     enqueueSnackbar("Please login with valid credentials.",{
  //       variant:"error",
  //       autoHideDuration:1000
  //     })
  //     setTimeout(()=>{
  //       router.push('/login');
  //     },1000);
  //   }
  // },[])


  useEffect(()=>{
    console.log(cookies.token);
  },[cookies]);

  const handleLogout = () =>{
    const token = cookies.token;
    dispatch(logout(Cookies.get('token')));
    dispatch(resetLoginState());
    dispatch(resetLogoutState());
    setTimeout(()=>{
      if(logout_state && logout_state?.data?.success){
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Set path accordingly
        removeCookie('token'); // Also remove using the Cookies library
        router.push('/');
      }
    },1000);
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
