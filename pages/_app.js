import "@/styles/globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { wrapper } from "@/store/store";
import { PersistGate } from 'redux-persist/integration/react';
import { useStore } from 'react-redux';

import Router from 'next/router';
import NProgress from 'nprogress'; //nprogress module
import '../styles/nprogress.css'; //styles of nprogress

//Route Events. 
Router.events.on('routeChangeStart', () => NProgress.start()); 
Router.events.on('routeChangeComplete', () => NProgress.done()); 
Router.events.on('routeChangeError', () => NProgress.done());

function App({ Component, pageProps }) {
  const store = useStore();
  return (
    <div>
      <PersistGate persistor={store.__persistor}>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
      </PersistGate>
    </div>
  );
}

export default wrapper.withRedux(App);