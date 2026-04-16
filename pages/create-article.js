import Head from "next/head";
import styles from "@/styles/create-article.module.css";
import { v4 as uuidv4 } from "uuid";
import { useSnackbar } from "notistack";
import { profile, resetProfileState } from "@/store/profileSlice";
import { useCookies } from "react-cookie";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router"; // Import useRouter
import Cookies from "js-cookie";
import Image from "next/image";
import Spinner from "@/components/spinner";
import dynamic from "next/dynamic";
import { Send } from "lucide-react";

const MediumEditor = dynamic(() => import("@/components/MediumEditor"), {
  ssr: false,
});

export default function Home() {
  const [articleHtml, setArticleHtml] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [descriptionWarning, setDescriptionWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [titleError, setTitleError] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [markDisabled, setDisabled] = useState(false);

  const [isAdmin, setAdmin] = useState(null);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const state = useSelector((state) => state.profile);

  useEffect(() => {
    if (cookies.token === undefined) {
      router.push("/");
    }
  }, []);

  const calculateTotalWordCount = (html) => {
    if (!html) return 0;
    // Strip HTML tags for word count
    const text = html.replace(/<[^>]+>/g, ' ');
    const count = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    return count;
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const submitHandle = async (event) => {
    event.preventDefault();

    // Get the form element
    const form = event.target;

    // Check if the form is valid
    if (!form.checkValidity()) {
      form.reportValidity(); // Show validation messages
      return; // Prevent submission if the form is invalid
    }

    // Validate title
    const title = form.title.value.trim();
    const wordCount = title.split(/\s+/).length;
    if (wordCount <= 9 || wordCount >= 26) {
      setTitleError("Title should be between 10 to 25 words long.");
      return; // Prevent submission if title validation fails
    } else {
      setTitleError("");
    }

    /* category validation */
    if (!selectedCategory) {
      setShowWarning(true);
      return;
    } else {
      setShowWarning(false);
    }

    /* description validation */
    if (!articleHtml || articleHtml.trim() === '') {
      setDescriptionWarning(true);
      return;
    }

    const totalWordCount = calculateTotalWordCount(articleHtml);

    if (totalWordCount <= 1) {
      setDescriptionWarning(true);
      return;
    } else {
      setDescriptionWarning(false);
    }

    let newFormData = new FormData(); // Create a new FormData object
    newFormData.append("title", event.target.title.value);
    newFormData.append("description", JSON.stringify(articleHtml)); // Store HTML string as JSON string for safety
    newFormData.append("category", selectedCategory);
    if (selectedFile) {
      newFormData.append("articleImage", selectedFile); // Append the file
    }

    let token = cookies?.token;

    setDisabled(true);

    try {
      let response = await fetch(
        `https://blog-zo8s.vercel.app/app/v2/createArticle?token=${token}`,
        {
          method: "POST",
          body: newFormData,
        }
      );
      let data = await response.json();
      if (!data?.success) {
        enqueueSnackbar(data?.message, {
          autoHideDuration: 2000,
          variant: "error",
        });
        setDisabled(false);
        return;
      }
      enqueueSnackbar(data?.message, {
        autoHideDuration: 2000,
        variant: "success",
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        "Failed to connect to the server. Please try again later.",
        {
          autoHideDuration: 2000,
          variant: "error",
        }
      );
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Articles</title>
        <meta
          name="description"
          content="Create articles and make updated to others with your insights and information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Create Articles" />
        <meta
          property="og:description"
          content="Create articles and make updated to others with your insights and information."
        />
        <link
          rel="canonical"
          href="https://webgrasper.vercel.app/create-article"
        />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      <div className={styles.root}>
        <main className={`${styles.main}`}>
          <form className={styles.formContainer} onSubmit={submitHandle}>
            <div className={styles.twoColumnContainer}>
              <div className={styles.leftColumn}>
                
                <div className={styles.inputFieldContainer} style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span className={styles.sectionLabel} style={{ marginBottom: 0 }}>Hero Image</span>
                    <button type="submit" className={styles.sendPublishButton} title="Publish Article" disabled={markDisabled}>
                      {markDisabled ? <Spinner /> : <Send size={16} />}
                    </button>
                  </div>
                  <label className={styles.imageUploadBox}>
                    {selectedFile ? (
                      <>
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className={styles.imagePreview} />
                        <div className={styles.imageUploadBtn} style={{backgroundColor: 'rgba(17,17,17,0.8)'}}>Change image</div>
                      </>
                    ) : (
                      <>
                        <svg className={styles.svgIcon} width="80" height="60" viewBox="0 0 100 80" fill="none" stroke="#d5cba8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="30" cy="25" r="8" fill="#d5cba8" stroke="none" />
                          <polyline points="10 65 35 40 55 60 75 40 90 60"></polyline>
                        </svg>
                        <div className={styles.imageUploadBtn}>Upload image</div>
                      </>
                    )}
                    <input
                      className={styles.customFileInput}
                      name="articleImage"
                      type="file"
                      onChange={handleFileChange}
                      required
                      accept="image/*"
                    />
                  </label>
                </div>

                <div className={styles.categoriesContainer}>
                  <span className={styles.sectionLabel}>Categories</span>
                  <div className={styles.customRadioGroup}>
                    {[
                      "National",
                      "World",
                      "Politics",
                      "Railway",
                      "Markets",
                      "Sports",
                      "Health",
                      "Education",
                      "AI & Machine Learning",
                      "Crypto & Web3",
                      "Gadgets & Hardware",
                      "Startups & VCs",
                      "Finance",
                      "Space Exploration",
                      "Climate Tech",
                      "EVs & Mobility"
                    ].map((category) => (
                      <label
                        key={category}
                        className={`${styles.customRadioLabel} ${
                          selectedCategory === category ? styles.selected : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category}
                          checked={selectedCategory === category}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                        />
                        <span className={styles.customRadioButton}></span>
                        {category}
                      </label>
                    ))}
                  </div>
                  {showWarning && (
                    <p className={styles.warning}>Please select a category.</p>
                  )}
                </div>
              </div>

              <div className={styles.rightColumn}>
                <div style={{ width: '100%' }}>
                  <span className={styles.sectionLabel}>TITLE</span>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className={styles.mediumTitleInput}
                    placeholder="Write your headline..."
                    required
                  />
                  {titleError && <p className={styles.warning}>{titleError}</p>}
                </div>
                
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                  <span className={styles.sectionLabel}>DESCRIPTION</span>
                  <div className={styles.editorContainerBox}>
                    <MediumEditor onChange={(html) => setArticleHtml(html)} />
                  </div>
                  {descriptionWarning && (
                    <p className={styles.warning}>
                      Please add a description with at least 300 words.
                    </p>
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
