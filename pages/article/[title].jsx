import Head from "next/head";
import Image from "next/image";
import SideBar from "@/components/sidebar";
import styles from "../../styles/article.module.css";
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
  useEffect(()=>{
    console.log(article?.description);
  },[article])
  return (
    <>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article?.description?.slice(0, 150)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article?.description?.slice(0, 150)} />

        <meta property="og:image" content={article?.articleImage?.[0] || "https://picsum.photos/1200/630"} />

        <link rel="canonical" href={`https://www.techamaan.com/${article.title.replace(/\s+/g, '-')}`} />

        <meta property="og:image" content="https://techamaan.com/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="./logo.png" />

      </Head>
      <div className={styles.articlePageSupremeContainer}>
        <div className={styles.articlePageMainContainer}>
          <div className={styles.articleMainContainer}>
            <div className={styles.articleContainer}>
                <h2>Title</h2>
                <h1>{article.title}</h1>
                <Image className={styles.articleImage} src={article.articleImage?.[0]} alt={article.title} width={800} height={600} quality={80} layout="responsive" objectFit="cover"/>
                <h2>Description</h2>
                <div className={styles.dynamicHtmlContent} dangerouslySetInnerHTML={{ __html: article?.description }}></div>
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
