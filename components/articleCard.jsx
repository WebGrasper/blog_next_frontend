import styles from "@/styles/articleCard.module.css";
import Image from "next/image";
import Link from "next/link";
import Renderer from "@/utils/renderer";
import { useEffect, useState } from "react";

function ArticleCard({ article }) {
  const [description, setDescription] = useState('');

  //Rendering always first paragraph.
  useEffect(() => {
    const raw = article?.description;
    if (!raw) return;

    // Case 1: already a parsed array (e.g. passed from getServerSideProps that pre-parsed it)
    if (Array.isArray(raw)) {
      const firstParagraph = raw.find((desc) => desc.type === 'p');
      setDescription((firstParagraph?.data || '').slice(0, 120));
      return;
    }

    // Case 2 & 3: still a string — try JSON parse first
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Legacy format: JSON array
        const firstParagraph = parsed.find((desc) => desc.type === 'p');
        setDescription((firstParagraph?.data || '').slice(0, 120));
      } else if (typeof parsed === 'string') {
        // New format (stringified JSON string containing HTML)
        const plainText = parsed
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 120);
        setDescription(plainText);
      } else {
        setDescription('');
      }
    } catch {
      // Case 3: Raw HTML string that isn't stringified JSON
      const plainText = raw
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120);
      setDescription(plainText);
    }
  }, [article]);

  // Custom function to create a clean URL slug by removing special characters and replacing spaces with hyphens
  const createSlug = (title) => {
    return title.replace(/\s+/g, "-"); // Replace spaces with hyphens
  };

  return (
    <Link
      href="/article/[title]"
      as={`/article/${createSlug(article.title)}`}
      className={styles.root}
    >
      <div className={styles.imageContainer}>
        <div className={styles.categoryBadge}>{article?.category}</div>
        <Image
          className={styles.articleImage}
          width={400}
          height={250}
          src={article.articleImage[0]}
          alt={article.title}
          quality={80}
          unoptimized={false}
        />
      </div>

      <div className={styles.contentContainer}>
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.description}>{description}</p>
        
        <div className={styles.footer}>
          <Image
            className={styles.creatorImage}
            src={article?.creator?.avatar || "https://ik.imagekit.io/94nzrpaat/images/default-avatar.png"}
            alt={article?.creator?.username}
            width={32}
            height={32}
            loading="lazy"
          />
          <div className={styles.creatorInfo}>
            <span className={styles.creatorName}>{article?.creator?.username}</span>
            <span className={styles.publishDate}>{article.formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ArticleCard;
