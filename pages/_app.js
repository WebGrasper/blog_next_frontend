import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Head from "next/head";
import Router from "next/router";
import { Provider } from "react-redux";
import store from "@/store/store";
import { SnackbarProvider } from "notistack";
import { CookiesProvider } from "react-cookie";
import { useRouter } from "next/router";


import NProgress from "nprogress"; //nprogress module
import "../styles/nprogress.css"; //styles of nprogress
import { useEffect, useState } from "react";

//Route Events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App({ Component, pageProps }) {
  const router = useRouter();
  const [notAtPortfolioPage, setNotAtPortfolioPage] = useState(true);

  useEffect(()=>{
    if(router.pathname === '/portfolio'){
      setNotAtPortfolioPage(false);
    } else {
      setNotAtPortfolioPage(true)
    }
  },[router.pathname])
  return (
    <Provider store={store}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <SnackbarProvider>
          <div>
            <Head>
              <meta
                name="google-site-verification"
                content="W-J-mNMNzVPU3Qr3WfClrmnijPs3Ajn-j3pcUgOV16k"
              />
            </Head>
            {notAtPortfolioPage && <Navbar />}
            <Component {...pageProps} />
            {notAtPortfolioPage && <Footer />}
          </div>
        </SnackbarProvider>
      </CookiesProvider>
    </Provider>
  );
}

export default App;
