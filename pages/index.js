import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import SideBar from "@/components/sidebar";

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
  const articles = props?.state?.article;

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

        {/* Google Analytics (Optional)  */}
        {/* Add your Google Analytics tracking code here */}
        <meta
          name="google-site-verification"
          content="W-J-mNMNzVPU3Qr3WfClrmnijPs3Ajn-j3pcUgOV16k"
        />
      </Head>
      <div className={styles.homePageSupremeContainer}>
        <div className={styles.homePageMainContainer}>
          <div className={styles.dailyArticlesMainContainer}>
            <p>Daily Picks</p>
            {articles &&
              articles.map((article, index) => (
                <Link
                  href="/article/[title]"
                  as={`/article/${encodeURIComponent(article.title)}`}
                  className={styles.dailyArticlesContainer}
                  key={index}
                >
                  <div className={styles.dailyArticleImageContainer}>
                    <Image
                      className={styles.dailyArticleImage}
                      src={article.articleImage[0]}
                      width={210}
                      height={140}
                      alt={article.title}
                    />
                  </div>
                  <div className={styles.dailyArticleTitleContainer}>
                    <p className={styles.dailyArticleTitle}>{article.title}</p>
                    <p className={styles.dailyArticleDate}>
                      Updated &#8226;{" "}
                      {article.createdAt
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </p>
                    <p className={styles.dailyCategory}>
                      Category &#8226; {article.category}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
          <div className={styles.homePageSideBarContainer}>
            <SideBar />
          </div>
        </div>
      </div>
    </>
  );
}
