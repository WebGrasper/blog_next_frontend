import ArticleCard from "@/components/articleCard";
import styles from "@/styles/article-page.module.css";

function ArticlePage({ articles, name }) {
  return (
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
