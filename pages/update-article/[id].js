import Head from "next/head";
import styles from "@/styles/create-article.module.css";
import { useSnackbar } from "notistack";
import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import Image from "next/image";
import Spinner from "@/components/spinner";
import PLSpinner from "@/components/pageLoadingSpinner";
import { Send, ChevronLeft } from "lucide-react";
import SearchSelect from "@/components/SearchSelect";
import VellumEditor from "vellum-editor";
import 'vellum-editor/style.css';
import Link from "next/link";

export default function UpdateArticle() {
  const router = useRouter();
  const { id } = router.query;
  
  const [articleHtml, setArticleHtml] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showImageWarning, setShowImageWarning] = useState(false);
  const [descriptionWarning, setDescriptionWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [markDisabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token === undefined) {
      router.push("/");
      return;
    }
    
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/getArticleById/${id}`);
      const data = await response.json();
      if (data.success) {
        const article = data.article;
        setTitle(article.title);
        setSelectedCategory(article.category);
        setExistingImage(article.articleImage?.[0] || "");
        
        // Handle description which might be stringified JSON or raw HTML
        let desc = article.description;
        try {
          const parsed = JSON.parse(desc);
          if (typeof parsed === 'string') desc = parsed;
        } catch (e) {
          // keep as is
        }
        setArticleHtml(desc);
      } else {
        enqueueSnackbar(data.message || "Failed to fetch article", { variant: "error" });
        router.push("/profile");
      }
    } catch (error) {
      enqueueSnackbar("Error connecting to server", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalWordCount = (html) => {
    if (!html) return 0;
    const text = html.replace(/<[^>]+>/g, ' ');
    const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    return count;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setShowImageWarning(false);
  };

  const submitHandle = async (event) => {
    event.preventDefault();

    const wordCount = title.trim().split(/\s+/).length;
    if (wordCount <= 9 || wordCount >= 26) {
      setTitleError("Title should be between 10 to 25 words long.");
      return;
    } else {
      setTitleError("");
    }

    if (!selectedCategory) {
      setShowWarning(true);
      return;
    }

    if (!articleHtml || articleHtml.trim() === "") {
      setDescriptionWarning(true);
      return;
    }

    const totalWordCount = calculateTotalWordCount(articleHtml);
    if (totalWordCount <= 1) {
      setDescriptionWarning(true);
      return;
    }

    let newFormData = new FormData();
    newFormData.append("title", title);
    newFormData.append("description", JSON.stringify(articleHtml));
    newFormData.append("category", selectedCategory);
    if (selectedFile) {
      newFormData.append("articleImage", selectedFile);
    }

    let token = cookies?.token;
    setDisabled(true);

    try {
      let response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/updateArticle/${id}?token=${token}`,
        {
          method: "PUT",
          body: newFormData,
        }
      );
      let data = await response.json();
      if (!data?.success) {
        enqueueSnackbar(data?.message, { variant: "error" });
        setDisabled(false);
        return;
      }
      enqueueSnackbar("Article updated successfully!", { variant: "success" });
      router.push("/profile");
    } catch (error) {
      enqueueSnackbar("Failed to update article", { variant: "error" });
    } finally {
      setDisabled(false);
    }
  };

  if (loading) return <PLSpinner />;

  return (
    <>
      <Head>
        <title>Update Article | WebGrasper</title>
      </Head>
      <div className={styles.root}>
        <main className={`${styles.main}`}>
          <form className={styles.formContainer} onSubmit={submitHandle}>
            <div className={styles.mainContainer}>
              {/* LEFT COLUMN (Metadata) */}
              <div className={styles.leftColumn}>
                <Link href="/profile" style={{display: 'flex', alignItems: 'center', gap: '4px', color: '#666', fontSize: '0.9rem', marginBottom: '1rem', textDecoration: 'none'}}>
                  <ChevronLeft size={16} /> Back to stories
                </Link>
                
                {/* 2. IMAGE SECTION */}
                <div className={styles.imageSection}>
                  <span className={styles.sectionLabel}>Hero Image</span>
                  <label className={styles.imageUploadBox}>
                    {selectedFile ? (
                      <img src={URL.createObjectURL(selectedFile)} alt="Preview" className={styles.imagePreview} />
                    ) : existingImage ? (
                      <img src={existingImage} alt="Existing" className={styles.imagePreview} />
                    ) : (
                      <svg className={styles.svgIcon} width="80" height="60" viewBox="0 0 100 80" fill="none" stroke="#d5cba8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="30" cy="25" r="8" fill="#d5cba8" stroke="none" />
                        <polyline points="10 65 35 40 55 60 75 40 90 60"></polyline>
                      </svg>
                    )}
                    <div className={styles.imageUploadBtn} style={{backgroundColor: (selectedFile || existingImage) ? 'rgba(17,17,17,0.8)' : '#111'}}>
                      {selectedFile || existingImage ? 'Change image' : 'Upload image'}
                    </div>
                    <input
                      className={styles.customFileInput}
                      name="articleImage"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>

                {/* 3. CATEGORY SECTION */}
                <div className={styles.categorySection}>
                  <span className={styles.sectionLabel}>Category</span>
                  <SearchSelect
                    options={[
                      "National", "World", "Politics", "Railway", "Markets", "Sports", "Health", "Education",
                      "AI & Machine Learning", "Crypto & Web3", "Gadgets & Hardware", "Startups & VCs",
                      "Finance", "Space Exploration", "Climate Tech", "EVs & Mobility"
                    ]}
                    value={selectedCategory}
                    onChange={(category) => {
                      setSelectedCategory(category);
                      setShowWarning(false);
                    }}
                    placeholder="Search or select category..."
                  />
                  {showWarning && <p className={styles.warning}>Please select a category.</p>}
                </div>
              </div>

              {/* RIGHT COLUMN (Content) */}
              <div className={styles.rightColumn}>
                {/* 1. TITLE SECTION */}
                <div className={styles.titleSection}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={styles.sectionLabel}>TITLE</span>
                    <button type="submit" className={styles.sendPublishButton} disabled={markDisabled}>
                      {markDisabled ? <Spinner /> : <><Send size={16} style={{marginRight: '6px'}}/> Update Story</>}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.mediumTitleInput}
                    placeholder="Write your headline..."
                    required
                  />
                  {titleError && <p className={styles.warning}>{titleError}</p>}
                </div>

                {/* 4. DESCRIPTION SECTION */}
                <div className={styles.descriptionSection}>
                  <span className={styles.sectionLabel}>DESCRIPTION</span>
                  <div className={styles.editorContainerBox}>
                    <VellumEditor 
                      value={articleHtml}
                      onChange={(html) => setArticleHtml(html)} 
                      placeholder={{
                        text: "Tell your story...",
                        color: "#94a3b8",
                        fontSize: "1.2rem",
                        opacity: 0.8
                      }}
                      editorSettings={{ backgroundColor: "transparent" }}
                      bubbleMenuSettings={{
                        backgroundColor: "#1e293b",
                        iconSize: 18,
                        border: "1px solid #334155",
                        hoverBg: "#334155",
                        hoverColor: "#60a5fa"
                      }}
                      storage={{
                        provider: 'imagekit',
                        config: {
                          publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC,
                          privateKey: process.env.NEXT_PUBLIC_IMAGEKIT_SECRET,
                          authenticationEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL,
                          folder: "blog_articles"
                        }
                      }}
                    />
                  </div>
                  {descriptionWarning && (
                    <p className={styles.warning}>Please add a description.</p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
