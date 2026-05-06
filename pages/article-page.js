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
  const page = context.query.page || 1;
  const limit = context.query.limit || 10;
  const category = context.query.category || "";

  const fetchCreators = async (creators) => {
    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/getArticlesCreators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creators }),
        }
      );
      response = await response.json();
      return response?.creators_data;
    } catch (error) {
      console.log("ArticlePage: Fetch creators: ", error);
    }
  };

  const extractCreators = async (articles, fetchCreators) => {
    let creators = articles.map((article) => article?.createdBy);
    return fetchCreators(creators);
  };

  let final_articles = [];
  let paginationData = { totalCount: 0, totalPages: 0, page: 1, limit: 10, category };
  let final_success = false;

  try {
    const categoryQuery = category ? `&category=${category}` : "";
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/search?name=${name}&page=${page}&limit=${limit}${categoryQuery}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const articlesData = await response.json();
    let { success, articles, totalCount, totalPages } = articlesData;
    final_success = success;
    paginationData = { totalCount, totalPages, page: parseInt(page), limit: parseInt(limit) };

    if (articles && Array.isArray(articles)) {
      final_articles = articles.map((art) => ({
        ...art,
        formattedDate: moment(art.createdAt).fromNow(),
      }));

      let creators = await extractCreators(final_articles, fetchCreators);
      final_articles = final_articles.map((article) => ({
        ...article,
        creator: creators.find((c) => c._id === article.createdBy),
      }));
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return {
    props: {
      success: final_success,
      articles: final_articles,
      pagination: paginationData,
      name,
    },
  };
};

import SearchSelect from "@/components/SearchSelect";
import Pagination from "@/components/Pagination/Pagination";

function ArticlePage({ success, articles, name, pagination }) {
  const [markDisabled, setDisabled] = useState(false);
  const router = useRouter();

  // Categories list to check if current 'name' is a category
  const categories = ["National", "World", "Politics", "Railway", "Markets", "Sports", "Health", "Education", "Technology"];
  const decodedName = decodeURIComponent(name.replace(/-/g, " "));
  const isDirectCategory = categories.some(cat => cat.toLowerCase() === decodedName.toLowerCase());

  const handlePageChange = (newPage) => {
    const catParam = pagination.category ? `&category=${pagination.category}` : "";
    router.push(`/article-page?name=${name}&page=${newPage}&limit=${pagination.limit}${catParam}`);
  };

  const handleLimitChange = (newLimit) => {
    const catParam = pagination.category ? `&category=${pagination.category}` : "";
    router.push(`/article-page?name=${name}&page=1&limit=${newLimit}${catParam}`);
  };

  return (
    <main className={styles.rootArticlePage}>
      <Head>
        <title>{`${decodedName} - WebGrasper`}</title>
        <meta name="description" content="Explore trending tech insights, programming tips, and top gadgets." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`https://webgrasper.vercel.app/article-page?name=${name}`} />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      {success ? (
        <section className={styles.articlePageMainContainer}>
          <div 
            className={styles.headerControls}
            style={{
              position: 'sticky',
              top: '4.25rem',
              background: 'rgba(255, 255, 255, 0.15',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 100,
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.25rem 0',
              maxWidth: '82.5rem',
              marginInline: 'auto',
              marginBottom: '2rem'
            }}
          >
            <div className={styles.leftControls}>
              {!isDirectCategory && (
                <SearchSelect 
                  options={categories}
                  value={pagination.category || ""} 
                  onChange={(val) => {
                    const catParam = val ? `&category=${val}` : "";
                    router.push(`/article-page?name=${name}&page=1&limit=${pagination.limit}${catParam}`);
                  }}
                  placeholder="All Categories"
                />
              )}
            </div>
            <div className={styles.rightControls}>
              <Pagination 
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                limit={pagination.limit}
                onPageChange={handlePageChange}
                onLimitChange={handleLimitChange}
              />
            </div>
          </div>

          <div className={styles.articleMainContainer}>
            {articles &&
              articles.map((article, index) => (
                <ArticleCard article={article} key={`${article._id}-${index}`} />
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
              src={"https://ik.imagekit.io/94nzrpaat/images/gold-logo-with-title-wg_853558-2748-N6dN8fcsA-transformed_1%20(1).png?updatedAt=1708801314331"}
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
