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

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [descriptionWarning, setDescriptionWarning] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [titleError, setTitleError] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [isAdmin, setAdmin] = useState(null);
  const router = useRouter();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const state = useSelector((state) => state.profile);

  useEffect(() => {
    if (state?.data?.user?.role === "admin") {
      setAdmin(true);
    } else {
      setAdmin(false);
    }
  }, [state]);

  useEffect(() => {
    if (Cookies.get("token") === "" || isAdmin === false) {
      router.push("/");
      enqueueSnackbar("You're not authorize to access this page.", {
        autoHideDuration: 1000,
        variant: "error",
      });
    }
  }, [isAdmin]);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const structures = [
    {
      type: "h2",
      selfClosing: "false",
      className: "heading2",
      data: "",
    },
    {
      type: "p",
      selfClosing: "false",
      className: "paragraph",
      data: "",
    },
    {
      type: "br",
      selfClosing: "true",
      className: "break",
    },
  ];

  const handleAddElement = (type) => {
    let structure = structures.find((struct) => struct.type === type);
    const newElement = {
      id: uuidv4(),
      ...structure,
    };
    setElements([...elements, newElement]);
  };

  const handleDeleteElement = (id) => {
    setElements((prevElements) =>
      prevElements.filter((element) => element.id !== id)
    );
  };

  const handleInputChange = (id, value) => {
    setElements((prevElements) =>
      prevElements.map((element) =>
        element.id === id ? { ...element, data: value } : element
      )
    );
  };

  const calculateTotalWordCount = (filteredElements) => {
    let totalWordCount = 0;
    for (const element of filteredElements) {
      totalWordCount += element.data.trim().split(/\s+/).length;
    }
    return totalWordCount;
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

    /* Remove empty elements */
    const filteredElements = elements.filter(
      (element) => element.data.trim() !== ""
    );
    setElements(filteredElements);

    /* category validation */
    if (!selectedCategory) {
      setShowWarning(true);
      return;
    } else {
      setShowWarning(false);
    }

    /* description validation */
    if (filteredElements.length === 0) {
      setDescriptionWarning(true);
      return;
    }

    const totalWordCount = await calculateTotalWordCount(filteredElements);

    if (totalWordCount <= 299) {
      setDescriptionWarning(true);
      return;
    } else {
      setDescriptionWarning(false);
    }

    let newFormData = new FormData(); // Create a new FormData object
    newFormData.append("title", event.target.title.value);
    newFormData.append("description", JSON.stringify(filteredElements)); // Convert to JSON string
    newFormData.append("category", selectedCategory);
    if (selectedFile) {
      newFormData.append("articleImage", selectedFile); // Append the file
    }

    console.log([...newFormData.entries()]);

    let token = cookies?.token;

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
      return;
    }
    enqueueSnackbar(data?.message, {
      autoHideDuration: 2000,
      variant: "success",
    });
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
          <div className={styles.container}>
            <h1>Create Article</h1>
            <form className={styles.formContainer} onSubmit={submitHandle}>
              <div className={styles.inputFieldContainer}>
                <label htmlFor="Email">Title*</label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Add main heading"
                  required
                />
                {titleError && <p className={styles.warning}>{titleError}</p>}
              </div>
              <div className={styles.inputFieldContainer}>
                <label htmlFor="Email">Image*</label>
                <input
                  className={styles.customFileInput}
                  name="articleImage"
                  type="file"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className={styles.inputFieldContainer}>
                <label htmlFor="Email">Category*</label>
                <div className={styles.customRadioGroup}>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Politics" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Politics"
                      checked={selectedCategory === "Politics"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Politics
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Technology" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Technology"
                      checked={selectedCategory === "Technology"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Technology
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Railway" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Railway"
                      checked={selectedCategory === "Railway"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Railway
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Sports" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Sports"
                      checked={selectedCategory === "Sports"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Sports
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Markets" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Markets"
                      checked={selectedCategory === "Markets"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Markets
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "India News" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="India News"
                      checked={selectedCategory === "India News"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    India News
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "International News" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="International News"
                      checked={selectedCategory === "International News"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    International News
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Health" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Health"
                      checked={selectedCategory === "Health"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Health
                  </label>
                  <label
                    className={`${styles.customRadioLabel} ${
                      selectedCategory === "Education" ? styles.selected : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value="Education"
                      checked={selectedCategory === "Education"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span className={styles.customRadioButton}></span>
                    Education
                  </label>
                </div>
                {showWarning && (
                  <p className={styles.warning}>Please select a category.</p>
                )}
              </div>
              <div className={styles.inputFieldContainer}>
                <div className={styles.container1}>
                  <div className={styles.headingContainer}>
                    <h3>Add description*</h3>
                  </div>
                  <div className={styles.addButton} onClick={handleClick}>
                    <Image
                      width={40}
                      height={40}
                      loading="lazy"
                      src="/add-icon.png"
                      alt="add-icon"
                      className={`${styles.img1} ${
                        isExpanded ? styles.rotateClockwise : ""
                      }`}
                      id="img1"
                    />
                    <Image
                      width={40}
                      height={40}
                      src="/heading-icon.png"
                      alt="heading-icon"
                      loading="lazy"
                      className={`${
                        isExpanded ? styles.showImg2 : styles.img2
                      }`}
                      id="img2"
                      onClick={() => handleAddElement("h2")}
                    />
                    <Image
                      width={40}
                      height={40}
                      loading="lazy"
                      src="/paragraph-icon.png"
                      alt="paragraph-icon"
                      className={`${
                        isExpanded ? styles.showImg3 : styles.img3
                      }`}
                      id="img3"
                      onClick={() => handleAddElement("p")}
                    />
                  </div>
                </div>
                {elements.map((element) => (
                  <div
                    key={element.id}
                    className={styles.dynamicInputContainer}
                  >
                    <textarea
                      key={element.id}
                      type="text"
                      className={styles.textarea}
                      value={element.data}
                      onChange={(e) =>
                        handleInputChange(element.id, e.target.value)
                      }
                      placeholder={`Enter text for ${element.type}`}
                    ></textarea>
                    <Image
                      width={24}
                      height={24}
                      src="/delete-icon.svg"
                      alt="delete icon"
                      className={styles.deleteIcon}
                      onClick={() => handleDeleteElement(element.id)}
                    />
                  </div>
                ))}
                {descriptionWarning && (
                  <p className={styles.warning}>
                    Please add a description with at least 300 words.
                  </p>
                )}
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
