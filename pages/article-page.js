import ArticleCard from "@/components/articleCard";
import Spinner from "@/components/spinner";
import styles from "@/styles/article-page.module.css";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { articleService } from "@/services/articleService";
import { articleUtils } from "@/utils/articleUtils";

export const getServerSideProps = async (context) => {
  const { name, page = 1, limit = 10, category = "" } = context.query;

  try {
    const articlesData = await articleService.searchArticles({ name, page, limit, category });
    const { success, articles, totalCount, totalPages } = articlesData;

    const final_articles = await articleUtils.processArticles(articles);
    const paginationData = {
      totalCount,
      totalPages,
      page: parseInt(page),
      limit: parseInt(limit),
      category,
    };

    return {
      props: {
        success,
        articles: final_articles,
        pagination: paginationData,
        name,
      },
    };
  } catch (error) {
    console.error("ArticlePage: getServerSideProps error:", error);
    return {
      props: {
        success: false,
        articles: [],
        pagination: { totalCount: 0, totalPages: 0, page: 1, limit: 10, category },
        name,
      },
    };
  }
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
