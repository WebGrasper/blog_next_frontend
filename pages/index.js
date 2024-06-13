import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import ArticleCard from "@/components/articleCard";
import moment from "moment";

export const getServerSideProps = async (context) => {
  let dailyArticlesdata = null;
  let dailyArticles = undefined;
  let dailyArticlesLimit = 4;

  try {
    let response = await fetch(
      `https://blog-zo8s.vercel.app/app/v2/dailyArticles?` +
        new URLSearchParams({
          limit: dailyArticlesLimit,
        }),
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

    dailyArticlesdata = await response.json();

    let { success, articles } = dailyArticlesdata;

    // Check if article is not undefined and is an array before mapping
    if (articles && Array.isArray(articles)) {
      dailyArticles = articles.map((art) => ({
        ...art,
        formattedDate: moment(art.createdAt).fromNow(), // Format the date using moment
      }));
    } else {
      dailyArticles = []; // Set article to an empty array if it's undefined or not an array
    }
    
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  let trendingArticlesData = null;
  let trendingArticles = undefined;
  let trendingArticlesLimit = 4;

  try {
    let response = await fetch(
      `https://blog-zo8s.vercel.app/app/v2/trendingArticles?` +
        new URLSearchParams({
          limit: trendingArticlesLimit,
        }),
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

    trendingArticlesData = await response.json();

    let { success, articles } = trendingArticlesData;

    // Check if article is not undefined and is an array before mapping
    if (articles && Array.isArray(articles)) {
      trendingArticles = articles.map((art) => ({
        ...art,
        formattedDate: moment(art.createdAt).fromNow(), // Format the date using moment
      }));
    } else {
      trendingArticles = []; // Set article to an empty array if it's undefined or not an array
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return {
    props: {
      dailyArticles,
      trendingArticles,
    },
  };
};

export default function Main({ dailyArticles, trendingArticles }) {
  return (
    <div className={styles.root}>
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
      <section className={styles.heroMainContainer}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <h1>
              <div>Stay</div>
              <div><span>updated.</span></div>
              <div>Stay <span>Curious.</span></div>
            </h1>
          </div>
          <div className={styles.heroImage}>
            <Image
              src="https://ik.imagekit.io/94nzrpaat/images/pixelcut-export%20(4).png?updatedAt=1718291940561"
              alt="hero image"
              className={styles.heroImage}
              width={100}
              height={100}
              unoptimized
              priority={false}
            />
          </div>
        </div>
      </section>
      <section className={styles.homePageSupremeContainer}>
        <div className={styles.dailyArticleHeadingContainer}>
          <h1>Daily Picks</h1>
        </div>
        <div className={styles.dailyArticlesMainContainer}>
          {dailyArticles &&
            dailyArticles.map((article, index) => (
              <ArticleCard article={article} key={index} />
            ))}
        </div>
      </section>
      <section className={styles.homePageSupremeContainer}>
        <div className={styles.trendingArticleHeadingContainer}>
          <h1>Trendings</h1>
        </div>
        <div className={styles.trendingArticlesMainContainer}>
          {trendingArticles &&
            trendingArticles.map((article, index) => (
              <ArticleCard article={article} key={index} />
            ))}
        </div>
      </section>
      <section className={styles.categoriesMainContainer}>
        <div className={styles.categoriesSubContainer}>
          <div className={styles.categoriesHeadingContainer}>
            <h2>What are you interested in?</h2>
            <p>
              Various articles are here to provide insights and help you stay
              updated about your surroundings.
            </p>
          </div>
          <div className={styles.categories}>
            <Link href="/article-page?name=India-News" passHref>
              <Image
                src="/india-icon.png"
                alt="india icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              India News
            </Link>
            <Link href="/article-page?name=International-News" passHref>
              <Image
                src="/world-icon.png"
                alt="world icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              International News
            </Link>
            <Link href="/article-page?name=Politics" passHref>
              <Image
                src="/politics-icon.png"
                alt="politics icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Politics
            </Link>
            <Link href="/article-page?name=Technology" passHref>
              <Image
                src="/technology-icon.png"
                alt="technology icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Technology
            </Link>
            <Link href="/article-page?name=Markets" passHref>
              <Image
                src="/market-icon.png"
                alt="market icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Markets
            </Link>
            <Link href="/article-page?name=Sports" passHref>
              <Image
                src="/sports-icon.png"
                alt="sports icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Sports
            </Link>
            <Link href="/article-page?name=Railway" passHref>
              <Image
                src="/railway-icon.png"
                alt="railway icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Railway
            </Link>
            <Link href="/article-page?name=Health" passHref>
              <Image
                src="/health-icon.png"
                alt="health icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Health
            </Link>
            <Link href="/article-page?name=Education" passHref>
              <Image
                src="/education-icon.png"
                alt="education icon"
                className={styles.heroImage}
                width={20}
                height={20}
                unoptimized
                priority={false}
              />
              Education
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
