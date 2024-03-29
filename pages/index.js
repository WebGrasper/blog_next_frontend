import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import ArticleCard from "@/components/articleCard";

export const getServerSideProps = async (context) => {
  let data = null;
  try {
    let response = await fetch(
      "https://blog-zo8s.vercel.app/app/v2/getArticles",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    data = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  let { success, article } = data;
  return {
    props: {
      article,
    },
  };
};

export default function Main({ article }) {
  return (
    <div>
      <Head>
        <title>WebGrasper: Discover insights, tips, gadgets – your hub!</title>
        <meta
          name="description"
          content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:title"
          content="WebGrasper: Discover insights, tips, gadgets – your hub!"
        />
        <meta
          property="og:description"
          content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology."
        />
        <link rel="canonical" href="https://webgrasper.vercel.app/" />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      <section className={styles.heroContainer}>
        <picture>
          <Image
            src="https://ik.imagekit.io/94nzrpaat/images/dariusz-sankowski-3OiYMgDKJ6k-unsplash.jpg?updatedAt=1709999343480"
            alt="hero image"
            className={styles.heroImage}
            width={100}
            height={100}
            loading="lazy"
          />
        </picture>
        <div className={styles.heroContent}>
          <h1>
            <span>Stay</span>
            <span>Curious.</span>
          </h1>
        </div>
      </section>
      <section className={styles.homePageSupremeContainer}>
        <div className={styles.dailyArticleHeadingContainer}>
          <h1>Daily Picks</h1>
        </div>
        <div className={styles.dailyArticlesMainContainer}>
          {article &&
            article.map((article, index) => (
              <ArticleCard article={article} key={index} />
            ))}
        </div>
      </section>
    </div>
  );
}
