import Head from "next/head";
import styles from "@/styles/my-articles.module.css";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Link from "next/link";
import { Edit2, Trash2, Plus, Eye } from "lucide-react";
import PLSpinner from "@/components/pageLoadingSpinner";
import Spinner from "@/components/spinner";

export default function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [cookies] = useCookies(["token"]);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const fetchMyArticles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/getMyArticles?token=${cookies.token}`);
      const data = await response.json();
      if (data.success) {
        setArticles(data.articles);
      } else {
        enqueueSnackbar(data.message || "Failed to fetch articles", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error connecting to server", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!cookies.token) {
      router.push("/");
      return;
    }
    fetchMyArticles();
  }, [cookies.token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    setDeleteLoading(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/deleteArticle/${id}?token=${cookies.token}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Article deleted successfully", { variant: "success" });
        setArticles(articles.filter((a) => a._id !== id));
      } else {
        enqueueSnackbar(data.message || "Failed to delete article", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error connecting to server", { variant: "error" });
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) return <PLSpinner />;

  return (
    <div className={styles.container}>
      <Head>
        <title>My Articles | WebGrasper</title>
      </Head>

      <div className={styles.wrapper}>
        <header className={styles.header}>
          <div>
            <h1 className={styles.title}>Your Stories</h1>
            <p className={styles.subtitle}>Manage and edit your published content</p>
          </div>
          <Link href="/create-article" className={styles.createBtn}>
            <Plus size={18} />
            <span>Write New Story</span>
          </Link>
        </header>

        <div className={styles.articleList}>
          {articles.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>You haven't written any stories yet.</h3>
              <p>Share your thoughts with the world and start your writing journey today.</p>
              <Link href="/create-article" className={styles.miniCreateBtn}>Start writing</Link>
            </div>
          ) : (
            articles.map((article) => (
              <div key={article._id} className={styles.articleItem}>
                <div className={styles.articleInfo}>
                  <span className={styles.category}>{article.category}</span>
                  <h2 className={styles.articleTitle}>{article.title}</h2>
                  <div className={styles.meta}>
                    <span>Published on {new Date(article.createdAt).toLocaleDateString()}</span>
                    <span className={styles.dot}>•</span>
                    <span>{article.impressions || 0} views</span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Link href={`/article/${article.title.trim().replace(/\s+/g, "-")}`} className={styles.actionBtn} title="View">
                    <Eye size={18} />
                  </Link>
                  <Link href={`/update-article/${article._id}`} className={styles.actionBtn} title="Edit">
                    <Edit2 size={18} />
                  </Link>
                  <button 
                    className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                    onClick={() => handleDelete(article._id)}
                    disabled={deleteLoading === article._id}
                    title="Delete"
                  >
                    {deleteLoading === article._id ? <Spinner /> : <Trash2 size={18} />}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
