import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";

export async function getServerSideProps(context) {
  const response = await fetch("https://blog-zo8s.vercel.app/app/v2/getArticles");
  const state = await response.json();
  return {
    props: {
      state,
    },
  };
}

export default function Main(props) {
  const blogs = props?.state?.article;
  console.log(blogs[0]);
  return (
    <>
    <Head>
        <title>newstash: Stay Informed with newstash</title>
        <meta
          name="description"
          content="Explore insightful articles on tech, lifestyle, and more. Stay informed, share thoughts, and enrich your knowledge. Join our community now for engaging content!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO Meta Tags */}
        <meta
          property="og:title"
          content="newstash: Stay Informed with Stashify"
        />
        <meta
          property="og:description"
          content="Explore insightful articles on tech, lifestyle, and more. Stay informed, share thoughts, and enrich your knowledge. Join our community now for engaging content!"
        />
        <meta property="og:image" content="https://picsum.photos/1200/630" />
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon  */}
        <link rel="icon" href="./logo.png" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />

        {/* Google Analytics (Optional)  */}
        {/* Add your Google Analytics tracking code here */}
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="google-site-verification"
          content="W-J-mNMNzVPU3Qr3WfClrmnijPs3Ajn-j3pcUgOV16k"
        />
      </Head>
      <div className={styles.homePageSupremeContainer}>
        <div className={styles.homePageMainContainer}>
          <div className={styles.dailyArticlesMainContainer}>
            <p>Daily Picks</p>
            {blogs &&
              blogs.map((blog, index) => (
                <Link
                  href="/article/[title]"
                  as={`/article/${encodeURIComponent(blog.title)}`}
                  className={styles.dailyArticlesContainer}
                  key={index}
                >
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
                </Link>
              ))}
          </div>
          <div className={styles.homePageSideBarContainer}>
            <div className={`${styles.homePageSideBar}`}>
              <p className={styles.sideBarTitle}>Read like a Pro</p>
              <div className={styles.sideBarNotePoints}>
                <Image
                  src="/connectedIcon.svg"
                  width={18}
                  height={18}
                  alt="connect icon"
                />
                <p>
                  Stay <span>connected</span>
                </p>
              </div>
              <div className={styles.sideBarNotePoints}>
                <Image
                  src="/updateIcon.svg"
                  width={18}
                  height={18}
                  alt="update icon"
                />
                <p>
                  Stay <span>updated</span>
                </p>
              </div>
              <form action="#" method="post" className={styles.subscribeForm}>
                <input type="text" placeholder="email address..." />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
