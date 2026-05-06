import Link from "next/link";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Head from "next/head";
import ArticleCard from "@/components/articleCard";
import moment from "moment";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "@/components/spinner";

export const getServerSideProps = async (context) => {
  const fetchCreators = async (creators) => {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/getArticlesCreators`,
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

  let dailyArticlesdata = null;
  let dailyArticles = undefined;
  let dailyArticlesLimit = 4;

  try {
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/dailyArticles?` +
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

      let creators = await extractCreators(dailyArticles, fetchCreators);
      // Map creators to their respective articles
      dailyArticles = dailyArticles.map((article) => {
        const creator = creators.find(
          (creator) => creator._id === article.createdBy
        );
        return {
          ...article,
          creator,
        };
      });
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/trendingArticles?` +
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

      let creators = await extractCreators(trendingArticles, fetchCreators);
      // Map creators to their respective articles
      trendingArticles = trendingArticles.map((article) => {
        const creator = creators.find(
          (creator) => creator._id === article.createdBy
        );
        return {
          ...article,
          creator,
        };
      });

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

export default function Main({ dailyArticles: initialDaily, trendingArticles: initialTrending }) {
  const [dailyArticles, setDailyArticles] = useState(initialDaily);
  const [trendingArticles, setTrendingArticles] = useState(initialTrending);
  
  const [dailyPage, setDailyPage] = useState(1);
  const [trendingPage, setTrendingPage] = useState(1);
  
  const [dailyTotalPages, setDailyTotalPages] = useState(1);
  const [trendingTotalPages, setTrendingTotalPages] = useState(1);

  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);

  // Helper to fetch and map articles with creators
  const fetchArticlesWithCreators = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    if (!data.success) return { articles: [], totalPages: 1 };

    let articles = data.articles.map((art) => ({
      ...art,
      formattedDate: moment(art.createdAt).fromNow(),
    }));

    const creatorsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/getArticlesCreators`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creators: articles.map(a => a.createdBy) }),
      }
    );
    const creatorsData = await creatorsResponse.json();
    const creators = creatorsData?.creators_data || [];

    articles = articles.map((article) => ({
      ...article,
      creator: creators.find((c) => c._id === article.createdBy),
    }));

    return { articles, totalPages: data.totalPages };
  };

  const handleDailyPageChange = async (newPage) => {
    if (newPage < 1 || newPage > dailyTotalPages || loadingDaily) return;
    setLoadingDaily(true);
    const { articles, totalPages } = await fetchArticlesWithCreators(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/dailyArticles?limit=4&page=${newPage}`
    );
    setDailyArticles(articles);
    setDailyTotalPages(totalPages);
    setDailyPage(newPage);
    setLoadingDaily(false);
  };

  const handleTrendingPageChange = async (newPage) => {
    if (newPage < 1 || newPage > trendingTotalPages || loadingTrending) return;
    setLoadingTrending(true);
    const { articles, totalPages } = await fetchArticlesWithCreators(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/trendingArticles?limit=4&page=${newPage}`
    );
    setTrendingArticles(articles);
    setTrendingTotalPages(totalPages);
    setTrendingPage(newPage);
    setLoadingTrending(false);
  };

  // Set initial total pages from SSR (approximate or we could update API to send it in SSR too)
  useEffect(() => {
    // Initial fetch to get total pages (or we could have included it in SSR)
    const init = async () => {
      const d = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/dailyArticles?limit=4&page=1`);
      const t = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/trendingArticles?limit=4&page=1`);
      const dData = await d.json();
      const tData = await t.json();
      setDailyTotalPages(dData.totalPages || 1);
      setTrendingTotalPages(tData.totalPages || 1);
    };
    init();
  }, []);

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
              <div>
                <span>updated.</span>
              </div>
              <div>
                Stay <span>Curious.</span>
              </div>
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
              priority
            />
          </div>
        </div>
      </section>
      <section className={styles.homePageSupremeContainer}>
        <div className={styles.dailyArticleHeadingContainer}>
          <h1>Daily Picks</h1>
          <div className={styles.sectionPagination}>
            <button 
              onClick={() => handleDailyPageChange(dailyPage - 1)} 
              disabled={dailyPage <= 1 || loadingDaily}
              className={styles.miniArrowBtn}
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.pageIndicator}>{dailyPage} / {dailyTotalPages}</span>
            <button 
              onClick={() => handleDailyPageChange(dailyPage + 1)} 
              disabled={dailyPage >= dailyTotalPages || loadingDaily}
              className={styles.miniArrowBtn}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className={`${styles.dailyArticlesMainContainer} ${loadingDaily ? styles.loadingGrid : ''}`}>
          {loadingDaily ? (
            <div className={styles.gridLoader}><Spinner /></div>
          ) : (
            dailyArticles && dailyArticles.map((article, index) => (
              <ArticleCard article={article} key={`${article._id}-${index}`} />
            ))
          )}
        </div>
      </section>
      <section className={styles.homePageSupremeContainer}>
        <div className={styles.trendingArticleHeadingContainer}>
          <h1>Trending</h1>
          <div className={styles.sectionPagination}>
            <button 
              onClick={() => handleTrendingPageChange(trendingPage - 1)} 
              disabled={trendingPage <= 1 || loadingTrending}
              className={styles.miniArrowBtn}
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.pageIndicator}>{trendingPage} / {trendingTotalPages}</span>
            <button 
              onClick={() => handleTrendingPageChange(trendingPage + 1)} 
              disabled={trendingPage >= trendingTotalPages || loadingTrending}
              className={styles.miniArrowBtn}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className={`${styles.trendingArticlesMainContainer} ${loadingTrending ? styles.loadingGrid : ''}`}>
          {loadingTrending ? (
            <div className={styles.gridLoader}><Spinner /></div>
          ) : (
            trendingArticles && trendingArticles.map((article, index) => (
              <ArticleCard article={article} key={`${article._id}-${index}`} />
            ))
          )}
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
