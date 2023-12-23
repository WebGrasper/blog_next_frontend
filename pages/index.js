import Head from "next/head";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps(context) {
  const response = await fetch(
    "https://blog-zo8s.vercel.app/app/v2/getArticles"
  );
  const state = await response.json();
  return {
    props: {
      state,
    },
  };
}


export default function Home(props) {
  const blogs = props?.state?.article;
  console.log(blogs[0]);

  const [isStickyHomePageSideBar, setStickyHomePageSideBar] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        const offset = window.scrollY;
  
          if (offset > 1) {
            setStickyHomePageSideBar(true);
          } else {
            setStickyHomePageSideBar(false);
          }
        }
      window.addEventListener("scroll", handleScroll);
  
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);


  return (
    <>
      <Head>
        <title>Stashify: Stay Informed, Stay Stashed with Stashify</title>
        <meta
          name="description"
          content="Explore insightful articles and engaging content on a variety of topics with our Blog app. Discover the latest trends, expert opinions, and valuable information to stay informed and entertained. Join our community and share your thoughts by reading and commenting on thought-provoking blog posts. Whether you're interested in technology, lifestyle, or creative arts, our blog has something for everyone. Dive into a world of captivating stories and enrich your knowledge with our diverse range of blog articles."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO Meta Tags */}
        <meta
          property="og:title"
          content="Stashify: Stay Informed, Stay Stashed with Stashify"
        />
        <meta
          property="og:description"
          content="Explore insightful articles and engaging content on a variety of topics with our Blog app. Discover the latest trends, expert opinions, and valuable information to stay informed and entertained. Join our community and share your thoughts by reading and commenting on thought-provoking blog posts. Whether you're interested in technology, lifestyle, or creative arts, our blog has something for everyone. Dive into a world of captivating stories and enrich your knowledge with our diverse range of blog articles."
        />
        <meta property="og:image" content="https://picsum.photos/1200/630" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon  */}
        <link rel="icon" href="./logo.png" />

        {/* Google Analytics (Optional)  */}
        {/* Add your Google Analytics tracking code here */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className={styles.homePageSupremeContainer}>
        <div className={styles.homePageMainContainer}>
          <div className={styles.dailyArticlesMainContainer}>
            <p>Daily Picks</p>
            {blogs &&
              blogs.map((blog, index) => (
                <div className={styles.dailyArticlesContainer} key={index}>
                  <div className={styles.dailyArticleImageContainer}>
                    <Image
                      className={styles.dailyArticleImage}
                      src={blog.articleImage[0]}
                      width={210}
                      height={140}
                      alt={blog.title}
                    />
                  </div>
                  <div className={styles.dailyArticleTitleContainer}>
                    <p className={styles.dailyArticleTitle}>{blog.title}</p>
                    <p className={styles.dailyArticleDate}>
                      Updated &#8226;{" "}
                      {blog.createdAt
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </p>
                    <p className={styles.dailyCategory}>
                      Category &#8226; {blog.category}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className={`${styles.homePageSideBar} ${isStickyHomePageSideBar ? styles.stickHomePageSideBar : ""}`}>
            <p className={styles.sideBarTitle}>Read like a Pro</p>
            <div className={styles.sideBarNotePoints}>
              <Image
                src="/connectedIcon.svg"
                width={18}
                height={18}
                alt="connect icon"
              />
              <p>Stay <span>connected</span></p>
            </div>
            <div className={styles.sideBarNotePoints}>
              <Image
                src="/updateIcon.svg"
                width={18}
                height={18}
                alt="update icon"
              />
              <p>Stay <span>updated</span></p>
            </div>
            <form action="#" method="post" className={styles.subscribeForm}>
              <input type="text" placeholder="email address..." />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
