import ArticleCard from "@/components/articleCard";
import styles from "@/styles/article-page.module.css";
import Head from "next/head";

function ArticlePage({ articles, name }) {
  return (
    <>
      <Head>
        <title>{`${decodeURIComponent(name.replace(/-/g, " "))} - WebGrasper`}</title>
        <meta
          name="description"
          content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:title"
          content={`${decodeURIComponent(name.replace(/-/g, " "))} - WebGrasper`}
        />
        <meta
          property="og:description"
          content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology."
        />
        <link rel="canonical" href={`https://webgrasper.vercel.app/article-page?name=${name}`} />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      <section className={styles.articlePageMainContainer}>
        <div className={styles.articleHeadingContainer}>
          <h1>{decodeURIComponent(name.replace(/-/g, " "))}</h1>
        </div>
        <div className={styles.articleMainContainer}>
          {articles &&
            articles.map((article, index) => (
              <ArticleCard article={article} key={index} />
            ))}
        </div>
      </section>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const name = context.query.name;
  const response = await fetch(
    `https://blog-zo8s.vercel.app/app/v2/search?name=${name}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  let { success, articles } = data;
  return {
    props: {
      articles,
      name,
    },
  };
};

export default ArticlePage;
