import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { openModal } from "@/store/authUISlice";
import PLSpinner from "@/components/pageLoadingSpinner";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // Open the modal on mount
    dispatch(openModal('login'));
    // Redirect to home so the modal appears over the home content
    router.replace("/");
  }, []);

  return (
    <div>
      <Head>
        <title>Login | WebGrasper</title>
        <meta name="description" content="Login to your WebGrasper account." />
      </Head>
      <PLSpinner />
    </div>
  );
}
