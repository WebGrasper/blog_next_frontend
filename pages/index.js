import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import SideBar from "@/components/sidebar";
import { wrapper } from "@/store/store";
import { fetchArticles } from "@/store/articlesSlice";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await store.dispatch(fetchArticles());
    const state = store.getState();
    const { isLoading, data, isError } = state?.articles;
    const { success, article } = data;
    return {
      props: {
        article,
      },
    };
  }
);

export default function Main(props) {
  const articles = props?.article;
  return (
    <div>
      <Head>
        <title>Tech Amaan: Discover insights, tips, gadgets – your hub!</title>
        <meta name="description" content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Tech Amaan: Discover insights, tips, gadgets – your hub!" />
        <meta property="og:description" content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology." />
        <link rel="canonical" href="https://www.techamaan.com/" />

        <meta property="og:image" content="https://techamaan.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="./logo.png" />
      </Head>

      <div className={styles.homePageSupremeContainer}>
        <div className={styles.homePageMainContainer}>
          <div className={styles.dailyArticlesMainContainer}>
            <h1>Daily Picks</h1>
            {articles &&
              articles.map((article, index) => (
                <Link
                  href="/article/[title]"
                  as={`/article/${encodeURIComponent(article.title.replace(/\s+/g, '-'))}`}
                  className={styles.dailyArticlesContainer}
                  key={index}
                >
                  <div className={styles.dailyArticleImageContainer}>
                    <Image
                      className={styles.dailyArticleImage}
                      src={article.articleImage[0]}
                      width={160}
                      height={160}
                      alt={article.title}
                    />
                  </div>
                  <div className={styles.dailyArticleTitleContainer}>
                    <h2 className={styles.dailyArticleTitle}>{article.title}</h2>
                    <p className={styles.dailyArticleDescription} dangerouslySetInnerHTML={{ __html: `${article?.description.slice(0, 250)}&hellip;` }}></p>
                    <div className={styles.dailyArticleDateContainer}>
                    <h3 className={styles.dailyArticleDate}>
                      Updated &#8226;{" "}
                      {article.createdAt
                        .slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </h3>
                    <h4 className={styles.dailyCategory}>
                      Category &#8226; {article.category}
                    </h4>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
          <div className={styles.homePageSideBarContainer}>
            <SideBar />
          </div>
        </div>
      </div>
    </div>
  );
}
