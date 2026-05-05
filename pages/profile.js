import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "@/styles/profile.module.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router"; // Import useRouter
import { profile, resetProfileState } from "@/store/profileSlice";
import { useCookies } from "react-cookie";
import { resetLoginState } from "@/store/loginSlice";
import Spinner from "@/components/spinner";
import PLSpinner from "@/components/pageLoadingSpinner";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  LogOut, 
  PlusCircle, 
  Camera,
  X,
  Save,
  Globe,
  Briefcase,
  Pencil,
  Trash2
} from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { delay } from "lodash";

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [markDisabled, setDisabled] = useState(false);
  const [isEditableFormOpen, setEditableFormOpen] = useState(false);
  const [markFormSubmit, setFormSubmit] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [errors, setErrors] = useState({});
  const [imageUploadFormState, setImageUploadFormState] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isImageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stories"); // "stories" or "about"
  const [userArticles, setUserArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    articleId: null,
    title: "",
    description: ""
  });

  const state = useSelector((state) => state.profile);

  const fetchData = async() => {
    if (cookies.token === undefined) {
      router.push("/");
      return;
    }
    dispatch(profile(cookies.token));
  };

  useEffect(() => {
    if (state?.data === null) {
      fetchData();
    }
  }, [state?.data]);

  useEffect(() => {
    if(state?.data?.success){
      setProfileData(state?.data);
      setLoading(false);
      fetchUserArticles();
    }
  }, [state?.data]);

  const fetchUserArticles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/getMyArticles?token=${cookies.token}`);
      const data = await response.json();
      if (data.success) {
        setUserArticles(data.articles);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setArticlesLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    setDeleteLoading(id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v2/deleteArticle/${id}?token=${cookies.token}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        enqueueSnackbar("Article deleted successfully", { variant: "success" });
        setUserArticles(userArticles.filter((a) => a._id !== id));
      } else {
        enqueueSnackbar(data.message || "Failed to delete article", { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("Error connecting to server", { variant: "error" });
    } finally {
      setDeleteLoading(null);
    }
  };

  const openDeleteConfirm = (article) => {
    setConfirmModal({
      isOpen: true,
      articleId: article._id,
      title: "Delete Story?",
      description: `Are you sure you want to delete "${article.title}"? This action cannot be undone.`
    });
  };

  const handleLogout = async () => {
    setDisabled(true);
    removeCookie("token", { path: '/' });
    removeCookie("username", { path: '/' });
    removeCookie("avatar", { path: '/' });
    dispatch(resetProfileState());
    dispatch(resetLoginState());
    router.push("/");
  };

  const handleEditableForm = () => {
    setEditableFormOpen((prev) => !prev);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    let token = cookies.token;
    const data = Object.fromEntries(formData.entries());

    /* form validation */

    let validationErrors = {};

    // Validation checks
    const { bio, street, city, state, country, dob } = data;

    if (bio && bio.length > 150) {
      validationErrors.bio = "Bio must be 150 characters or less";
    }

    if (street && street.split(" ").length > 10) {
      validationErrors.street = "Street must be 10 words or less";
    }

    const twoWordsRegex = /^(\w+\s\w+|\w+)$/;

    if (city && !twoWordsRegex.test(city)) {
      validationErrors.city = "City must be 2 words or less";
    }

    if (state && !twoWordsRegex.test(state)) {
      validationErrors.state = "State must be 2 words or less";
    }

    if (country && !twoWordsRegex.test(country)) {
      validationErrors.country = "Country must be 2 words or less";
    }

    const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;

    if (dob && !dobRegex.test(dob)) {
      validationErrors.dob = "Valid format is dd/mm/yyyy";
    } else if (dob) {
      const [day, month, year] = dob.split("/").map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const minYear = currentYear - 12;

      if (day < 1 || day > 31) {
        validationErrors.dob = "Day must be between 1 and 31";
      } else if (month < 1 || month > 12) {
        validationErrors.dob = "Month must be between 1 and 12";
      } else if (year > minYear) {
        validationErrors.dob = `Year must be ${minYear} or earlier`;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      setFormSubmit(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/updateMyDetails?` +
          new URLSearchParams({
            token: token,
          }),
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      setFormSubmit(false);
      handleEditableForm();
      dispatch(profile(cookies.token));
      enqueueSnackbar(result?.message, {
        variant: "success",
        autoHideDuration: 1000,
      });
    } catch (error) {
      console.log(error);
      enqueueSnackbar(result?.message, {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImageUpload = async (event) => {
    event.preventDefault();
    let newFormData = new FormData();
    if (selectedFile) {
      newFormData.append("avatar", selectedFile); // Append the file
    }
    let token = cookies.token;
    setImageUploading(true);
    let response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/app/v1/updateMyAvatar?token=${token}`,
      {
        method: "PUT",
        body: newFormData,
      }
    );
    let data = await response.json();
    if (!data?.success) {
      enqueueSnackbar(data?.message, {
        autoHideDuration: 2000,
        variant: "error",
      });
      setImageUploading(false);
      handleFormState();
      return;
    }
    enqueueSnackbar(data?.message, {
      autoHideDuration: 2000,
      variant: "success",
    });
    setImageUploading(false);
    await dispatch(profile(cookies.token));
    handleFormState();
  };

  const handleFormState = () => {
    setImageUploadFormState((prev) => !prev);
    if (!imageUploadFormState) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <div>
      <Head>
        <title>Profile | WebGrasper</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>

      <section className={styles.profileSupremeContainer}>
        {loading ? (
          <PLSpinner />
        ) : (
          <div className={styles.centeredColumn}>
            {/* Identity Header */}
            <header className={styles.identityHeader}>
              <div className={styles.avatarContainer}>
                <img
                  className={styles.avatar}
                  src={state?.data?.user?.avatar || "https://ik.imagekit.io/94nzrpaat/images/default-avatar.png"}
                  alt="Profile"
                  onClick={handleFormState}
                />
                <div className={styles.avatarEditHint} onClick={handleFormState}>
                  <Camera size={14} />
                </div>
              </div>

              <div className={styles.userInfo}>
                <h1 className={styles.username}>{state?.data?.user?.username}</h1>
                <p className={styles.bio}>{state?.data?.user?.bio || "No bio added yet."}</p>
              </div>

              <div className={styles.headerActions}>
                <Link href="/create-article" className={styles.actionBtn}>
                  <PlusCircle size={18} />
                  <span>Write</span>
                </Link>
                <button className={styles.actionBtn} onClick={handleEditableForm}>
                  {isEditableFormOpen ? <X size={18} /> : <Edit3 size={18} />}
                  <span>{isEditableFormOpen ? "Cancel" : "Edit Profile"}</span>
                </button>
                <button 
                  className={styles.logoutBtn} 
                  onClick={handleLogout}
                  disabled={markDisabled}
                >
                  <LogOut size={18} />
                </button>
              </div>
            </header>

            {/* Navigation Tabs */}
            <nav className={styles.tabNav}>
              <button 
                className={activeTab === 'stories' ? styles.activeTab : ''} 
                onClick={() => setActiveTab('stories')}
              >
                My Stories
              </button>
              <button 
                className={activeTab === 'about' ? styles.activeTab : ''} 
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </nav>

            <div className={styles.tabContent}>
              {activeTab === 'stories' ? (
                <div className={styles.storiesFeed}>
                   {articlesLoading ? (
                     <div style={{padding: '2rem', textAlign: 'center'}}><Spinner /></div>
                   ) : userArticles.length === 0 ? (
                     <div className={styles.placeholderContainer}>
                       <h3>Manage your stories</h3>
                       <p>View, edit, and delete your published and draft articles from your dedicated stories dashboard.</p>
                       <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                         <Link href="/create-article" className={styles.miniCreateBtn}>Start writing</Link>
                       </div>
                     </div>
                   ) : (
                      <div className={styles.articlesGrid}>
                        {userArticles.map(article => (
                          <div key={article._id} className={styles.articleCard}>
                            <div className={styles.cardImageContainer}>
                              <img 
                                src={article.articleImage?.[0] || "https://ik.imagekit.io/94nzrpaat/images/pixelcut-export%20(4).png"} 
                                alt={article.title}
                                className={styles.cardImage}
                              />
                              <span className={styles.cardCategory}>{article.category}</span>
                            </div>
                            
                            <div className={styles.cardBody}>
                              <h4 className={styles.cardTitle}>{article.title}</h4>
                              <div className={styles.cardFooter}>
                                <div className={styles.cardStats}>
                                  <span>{new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                  <span className={styles.dot}>•</span>
                                  <span>{article.impressions || 0} views</span>
                                </div>
                                <div className={styles.cardActions}>
                                  <Link href={`/update-article/${article._id}`} className={styles.iconBtnAction} title="Edit">
                                    <Pencil size={18} />
                                  </Link>
                                  <button 
                                    onClick={() => openDeleteConfirm(article)} 
                                    className={styles.iconBtnDelete}
                                    disabled={deleteLoading === article._id}
                                    title="Delete"
                                  >
                                    {deleteLoading === article._id ? "..." : <Trash2 size={18} />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                   )}
                </div>
              ) : (
                <div className={styles.aboutPanel}>
                  {isEditableFormOpen ? (
                    <form onSubmit={handleFormSubmit} className={styles.editForm}>
                      <div className={styles.formGroup}>
                        <label>Name</label>
                        <input
                          type="text"
                          value={profileData?.user?.username}
                          name="username"
                          onChange={(e) => setProfileData({...profileData, user: {...profileData.user, username: e.target.value}})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={profileData?.user?.email}
                          name="email"
                          onChange={(e) => setProfileData({...profileData, user: {...profileData.user, email: e.target.value}})}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Bio</label>
                        <textarea
                          rows={3}
                          value={profileData?.user?.bio || ""}
                          name="bio"
                          onChange={(e) => setProfileData({...profileData, user: {...profileData.user, bio: e.target.value}})}
                        />
                        {errors?.bio && <span className={styles.error}>{errors.bio}</span>}
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label>Birthday</label>
                          <input
                            type="text"
                            placeholder="dd/mm/yyyy"
                            value={profileData?.user?.dob}
                            name="dob"
                            onChange={(e) => setProfileData({...profileData, user: {...profileData.user, dob: e.target.value}})}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <label>City</label>
                          <input
                            type="text"
                            value={profileData?.user?.city}
                            name="city"
                            onChange={(e) => setProfileData({...profileData, user: {...profileData.user, city: e.target.value}})}
                          />
                        </div>
                      </div>
                      <button type="submit" className={styles.saveBtn} disabled={markFormSubmit}>
                        {markFormSubmit ? <Spinner /> : <><Save size={18} /> Save</>}
                      </button>
                    </form>
                  ) : (
                    <div className={styles.detailsList}>
                      <div className={styles.detailItem}>
                        <label>Email</label>
                        <p>{state?.data?.user?.email}</p>
                      </div>
                      <div className={styles.detailItem}>
                        <label>Location</label>
                        <p>{state?.data?.user?.city || "Unknown City"}, {state?.data?.user?.country || "Earth"}</p>
                      </div>
                      {state?.data?.user?.dob && (
                        <div className={styles.detailItem}>
                          <label>Birthday</label>
                          <p>{state?.data?.user?.dob}</p>
                        </div>
                      )}
                      <div className={styles.detailItem}>
                        <label>Street Address</label>
                        <p>{state?.data?.user?.street || "Not provided."}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Overlay */}
        {imageUploadFormState && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.modalHeader}>
                <h3>Update Photo</h3>
                <button onClick={handleFormState}><X size={20} /></button>
              </div>
              <form onSubmit={handleImageUpload} className={styles.uploadForm}>
                <input type="file" onChange={handleFileChange} required />
                <button type="submit" disabled={isImageUploading}>
                  {isImageUploading ? <Spinner /> : "Upload"}
                </button>
              </form>
            </div>
          </div>
        )}
        {/* Confirmation Modal */}
        <ConfirmModal 
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({...confirmModal, isOpen: false})}
          onConfirm={() => handleDeleteArticle(confirmModal.articleId)}
          title={confirmModal.title}
          description={confirmModal.description}
          confirmText="Yes, Delete"
          cancelText="No, Keep it"
          type="danger"
        />
      </section>
    </div>
  );
}
