import styles from "@/styles/articleCard.module.css";
import Image from "next/image";
import Link from "next/link";
import Renderer from "@/utils/renderer";
import { useEffect, useState } from "react";

function ArticleCard({ article }) {

  const [description, setDescription] = useState([]);

  useEffect(() => {
    setDescription(JSON.parse(article?.description));
  }, [article]);

  // Custom function to create a clean URL slug by removing special characters and replacing spaces with hyphens
  const createSlug = (title) => {
    return title.replace(/\s+/g, '-'); // Replace spaces with hyphens
  };

  return (
    <Link
      href="/article/[title]"
      as={`/article/${createSlug(article.title)}`}
      className={styles.ArticleCardContainer}
    >
      <div className={styles.imageContainer}>
        <Image
          className={styles.articleImage}
          width={176}
          height={112}
          src={article.articleImage[0]}
          alt={article.title}
          quality={50}
          priority={false}
        />
      </div>
      <div className={styles.TitleContainer}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.description}>{description[0]?.data}</p>
        <div className={styles.dateContainer}>
          <h3 className={styles.date}>
          {article.formattedDate}
          </h3>
          <h4 className={styles.category}>{article.category}</h4>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
