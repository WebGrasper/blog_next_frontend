import ArticleCard from "@/components/articleCard";
import Spinner from "@/components/spinner";
import styles from "@/styles/article-page.module.css";
import moment from "moment";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const getServerSideProps = async (context) => {
  const name = context.query.name;

  const fetchCreators = async (creators) => {
    try {
      let response = await fetch(
        `https://blog-zo8s.vercel.app/app/v1/getArticlesCreators`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ creators }),
        }
      );
      response = await response.json();
      return response?.creators_data;
    } catch (error) {
      console.log("Home: Fetch creators: ", error);
    }
  };

  const extractCreators = async (articles, fetchCreators) => {
    let creators = articles.map((article) => article?.createdBy);
    return fetchCreators(creators);
  };

  let articlesData = null;
  let final_articles = [];
  let final_success = null;

  try {
    const response = await fetch(
      `https://blog-zo8s.vercel.app/app/v2/search?name=${name}`,
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

    articlesData = await response.json();
    let { success, articles } = articlesData;
    console.log(articles);
    final_success = success;

    // Check if article is not undefined and is an array before mapping
    if (articles && Array.isArray(articles)) {
      final_articles = articles.map((art) => ({
        ...art,
        formattedDate: moment(art.createdAt).fromNow(), // Format the date using moment
      }));

      let creators = await extractCreators(final_articles, fetchCreators);
      // Map creators to their respective articles
      final_articles = final_articles.map((article) => {
        const creator = creators.find(
          (creator) => creator._id === article.createdBy
        );
        return {
          ...article,
          creator,
        };
      });
    } else {
      articles = []; // Set article to an empty array if it's undefined or not an array
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return {
    props: {
      success: final_success,
      articles: final_articles,
      name,
    },
  };
};

function ArticlePage({ success, articles, name }) {

  const [markDisabled, setDisabled] = useState(false);

  const router = useRouter();

  return (
    <main className={styles.rootArticlePage}>
      <Head>
        <title>{`${decodeURIComponent(
          name.replace(/-/g, " ")
        )} - WebGrasper`}</title>
        <meta
          name="description"
          content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta
          property="og:title"
          content={`${decodeURIComponent(
            name.replace(/-/g, " ")
          )} - WebGrasper`}
        />
        <meta
          property="og:description"
          content="Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology."
        />
        <link
          rel="canonical"
          href={`https://webgrasper.vercel.app/article-page?name=${name}`}
        />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      {success ? (
        <section className={styles.articlePageMainContainer}>
          <div className={styles.articleHeadingContainer}>
            <p>Results for: </p>
            <h2>{decodeURIComponent(name.replace(/-/g, " "))}</h2>
          </div>
          <div className={styles.articleMainContainer}>
            {articles &&
              articles.map((article, index) => (
                <ArticleCard article={article} key={index} />
              ))}
          </div>
        </section>
      ) : (
        <section className={styles.documentNotFoundContainer}>
          <div className={styles.articleHeadingContainer}>
            <p>Results for: </p>
            <h2>{decodeURIComponent(name.replace(/-/g, " "))}</h2>
          </div>
          <div className={styles.notFoundImageContainer}>
            <Image
              src={
                "https://ik.imagekit.io/94nzrpaat/images/gold-logo-with-title-wg_853558-2748-N6dN8fcsA-transformed_1%20(1).png?updatedAt=1708801314331"
              }
              width={100}
              height={50}
              loading="lazy"
              unoptimized
              alt="not found image"
            />
            <div className={styles.notFoundContent}>
              <h2>No article is found.</h2>
              <p>Please return to the home page.</p>
            </div>
            <button type="button" onClick={(e)=>{
              e.preventDefault();
              setDisabled(true);
              router.push('/');
            }}>{markDisabled ? <Spinner/> : 'Home'}</button>
          </div>
        </section>
      )}
    </main>
  );
}

export default ArticlePage;
