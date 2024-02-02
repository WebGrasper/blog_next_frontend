import Head from "next/head";
import Image from "next/image";
import SideBar from "@/components/sidebar";
import styles from "../../styles/article.module.css";

export const getServerSideProps = async (context) => {
  const { title } = context.query;
  const response = await fetch(
    `https://blog-zo8s.vercel.app/app/v2/getSingleArticle/${title}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  let {success, article} = data;
  return {
    props: {
      article,
    },
  };
}


function Article({article}) {
  
  return (
    <div>
      <Head>
        <title>{article.title}</title>
        <meta name="description" content={article?.description?.slice(0, 150)} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article?.description?.slice(0, 150)} />

        <meta property="og:image" content={article?.articleImage?.[0] || "https://picsum.photos/1200/630"} />

        <link rel="canonical" href={`https://webgrasper.vercel.app/${article.title.replace(/\s+/g, '-')}`} />

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
              <Image className={styles.articleImage} src={article.articleImage?.[0]} alt={article.title} width={800} height={600} quality={80} layout="responsive" objectFit="cover" />
              <h2>Description</h2>
              <div className={styles.dynamicHtmlContent} >{article?.description}</div>
            </div>
          </div>
          <div className={styles.articlePageSideBarContainer}>
            <SideBar />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;
