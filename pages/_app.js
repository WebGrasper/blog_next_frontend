import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Head from "next/head";

import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "../styles/nprogress.css"; //styles of nprogress

//Route Events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <meta
          name="google-site-verification"
          content="google-site-verification=EeFZuVQzdFS4XDIVNCtJiEW_04egb0d8jV0q-6QE3sg"
        />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}

export default App;
