import Head from "next/head";
import SideBar from "@/components/sidebar";
import styles from "../../styles/article.module.css";
import Image from "next/image";
import { wrapper } from "@/store/store";
import { fetchSingleArticle } from "@/store/singleArticleSlice";
import { useEffect } from "react";

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const { title } = context.query;
    await store.dispatch(fetchSingleArticle({ title }));
    const { isLoading, data, isError } = store.getState().singleArticle;
    const {success, message} = data;
    // console.log(store.getState());

    if(!success){
      return{
        props:{
          warning: message,
        }
      }
    }

    return {
      props: {
        article: data.article,
      },
    };
  }
);


function Article(props) {
    const article = props.article || props?.warning;

  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article?.description?.slice(0, 150)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* SEO Meta Tags */}
        <meta property="og:title" content={article.title} />
        <meta
          property="og:description"
          content={article?.description?.slice(0, 150)}
        />
        {/* Use a dynamic og:image based on the blog post content or a default image */}
        <meta
          property="og:image"
          content={article?.articleImage?.[0] || "https://picsum.photos/1200/630"}
        />

        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon  */}
        <link rel="icon" href="/logo.png" />

        {/* Google Analytics (Optional)  */}
        {/* Add your Google Analytics tracking code here */}
        <meta
          name="google-site-verification"
          content="W-J-mNMNzVPU3Qr3WfClrmnijPs3Ajn-j3pcUgOV16k"
        />
      </Head>
      <div className={styles.articlePageSupremeContainer}>
        <div className={styles.articlePageMainContainer}>
          <div className={styles.articleMainContainer}>
            <div className={styles.articleContainer}>
              <div className={styles.titleHeadingContainer}>
                <p>Title</p>
                <h1>{article.title}</h1>
              </div>

              <div className={styles.articleImageContainer}>
                <Image
                  className={styles.articleImage}
                  src={article.articleImage?.[0]}
                  alt={article.title}
                  width={150}
                  height={120}
                />
              </div>
              <div className={styles.descriptionContainer}>
                <h2>Description</h2>
                <p>{article?.description}</p>
              </div>
            </div>
          </div>
          <div className={styles.articlePageSideBarContainer}>
            <SideBar />
          </div>
        </div>
      </div>
    </>
  );
}

export default Article;
