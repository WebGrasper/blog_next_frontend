import Head from "next/head";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { openModal } from "@/store/authUISlice";
import PLSpinner from "@/components/pageLoadingSpinner";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(openModal('forget'));
    router.replace("/");
  }, []);

  return (
    <div>
      <Head>
        <title>Forget Password | WebGrasper</title>
        <meta name="description" content="Reset your WebGrasper password." />
      </Head>
      <PLSpinner />
    </div>
  );
}
