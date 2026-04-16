import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { openModal } from "@/store/authUISlice";
import PLSpinner from "@/components/pageLoadingSpinner";

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(openModal('register'));
    router.replace("/");
  }, []);

  return (
    <div>
      <Head>
        <title>Register | WebGrasper</title>
        <meta name="description" content="Create a new WebGrasper account." />
      </Head>
      <PLSpinner />
    </div>
  );
}
