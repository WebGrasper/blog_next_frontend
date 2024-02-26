import styles from "@/styles/articleCard.module.css";
import Image from "next/image";
import Link from "next/link";

function ArticleCard({article}) {
  return (
    <Link
      href="/article/[title]"
      as={`/article/${encodeURIComponent(article.title.replace(/\s+/g, "-"))}`}
      className={styles.ArticleCardContainer}
    >
      <div className={styles.imageContainer}>
        <Image
          className={styles.articleImage}
          width={176}
          height={112}
          src={article.articleImage[0]}
          alt={article.title}
          loading="lazy"
        />
      </div>
      <div className={styles.TitleContainer}>
        <h2 className={styles.title}>{article.title}</h2>
        <p className={styles.description}>
          {article?.description.slice(0, 100)}&hellip;
        </p>
        <div className={styles.dateContainer}>
          <h3 className={styles.date}>
            {article.createdAt.slice(0, 10).split("-").reverse().join("-")}
          </h3>
          <h4 className={styles.category}>{article.category}</h4>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
