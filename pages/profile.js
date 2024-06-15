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

export default function Profile() {
  const dispatch = useDispatch();
  const [isAdmin, setAdmin] = useState(false);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [markDisabled, setDisabled] = useState(false);
  const [isEditableFormOpen, setEditableFormOpen] = useState(false);
  const [markFormSubmit, setFormSubmit] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [errors, setErrors] = useState({});

  const state = useSelector((state) => state.profile);

  const fetchData = () => {
    dispatch(profile(cookies.token));
  };
  useEffect(() => {
    if (state?.data === null) {
      fetchData();
    }
  }, [state?.data]);

  useEffect(() => {
    setProfileData(state?.data);
  }, [state?.data]);

  useEffect(() => {
    if (state?.data?.user?.role === "admin") {
      setAdmin(true);
    }
  }, [state]);

  const handleLogout = async () => {
    setDisabled(true);
    await router.push("/");
    removeCookie("token");
    removeCookie("username");
    removeCookie("avatar");
    dispatch(resetProfileState());
    setDisabled(false);
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
        `http://localhost:7860/app/v1/updateMyDetails?` +
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

  return (
    <div>
      <Head>
        <title>Profile: WebGrasper</title>
        <meta
          name="description"
          content="Login page to access profile. If profile not existing then create new one!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Login: WebGrasper" />
        <meta
          property="og:description"
          content="Login page to access profile. If profile not existing then create new one!"
        />
        <link rel="canonical" href="https://webgrasper.vercel.app/login" />

        <meta
          property="og:image"
          content="https://webgrasper.vercel.app/favicon.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" sizes="any" />
      </Head>
      <section className={styles.leftProfileSupremeContainer}>
        <div className={styles.leftProfileMainContainer}>
          <div className={styles.leftProfileContainer}>
            <div className={styles.leftProfileImageContainer}>
              <img
                className={styles.leftProfileImage}
                src={
                  state?.data?.user?.avatar ||
                  "https://ik.imagekit.io/94nzrpaat/images/resize.jpg?updatedAt=1708900407744"
                }
                alt="Profile image"
              />
              {isAdmin && (
                <div className={styles.adminPanelContainer}>
                  <Link
                    className={styles.adminPanelLink}
                    href={"/create-article"}
                  >
                    <img
                      className={styles.adminIcon}
                      src={"/admin-icon.png"}
                      alt="administrator icon"
                    />
                    <span>Admin panel</span>
                  </Link>
                </div>
              )}
            </div>
            <div className={styles.leftProfileDetailsContainer}>
              <div className={styles.leftNameContainer}>
                <p>{state?.data?.user?.username}</p>
              </div>
              <div className={styles.leftAddressContainer}>
                <img
                  className={styles.locationIcon}
                  src="/location-icon.png"
                  alt="location icon"
                />
                <p>
                  {state?.data?.user?.street || "(Add Street)"},{" "}
                  {state?.data?.user?.city || "(Add city)"}
                </p>
              </div>
              <div className={styles.leftBioContainer}>
                <img
                  className={styles.bioIcon}
                  src="/bio-icon.png"
                  alt="bio icon"
                />
                <p>{state?.data?.user?.bio || "(Add bio)"}</p>
              </div>
              <button onClick={handleLogout} className={styles.logout_button}>
                {markDisabled ? (
                  <Spinner />
                ) : (
                  <Image
                    src={"/logout-icon.png"}
                    width={20}
                    height={20}
                    alt="logout icon"
                  />
                )}
              </button>
            </div>
          </div>
          <div className={styles.rightProfileFormMainContainer} >
            <div className={styles.rightEditButtonContainer}>
              <h3>Edit details</h3>
              {!isEditableFormOpen ? (
                <Image
                  src={"/edit-icon.png"}
                  width={25}
                  height={25}
                  alt="edit icon"
                  onClick={handleEditableForm}
                />
              ) : (
                <Image
                  src={"/closeButtonBlack.svg"}
                  width={25}
                  height={25}
                  alt="close icon"
                  onClick={handleEditableForm}
                />
              )}
            </div>
            {!isEditableFormOpen ? (
              <div className={styles.rightProfileFormContainer}>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>Name*: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.username}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>Email*: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.email}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>Bio: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.bio || "N/A"}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>Date of birth: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.dob || "N/A"}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>Street: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.street || "N/A"}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>City: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.city || "N/A"}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>State: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.state || "N/A"}
                  </p>
                </div>
                <div className={styles.rightDetailContainer}>
                  <p className={styles.rightDetailHeading}>Country: </p>
                  <p className={styles.rightDetailValue}>
                    {state?.data?.user?.country || "N/A"}
                  </p>
                </div>
              </div>
            ) : (
              <form
                className={styles.rightProfileMainEditableFormContainer}
                onSubmit={handleFormSubmit}
              >
                <div className={styles.rightProfileEditableFormContainer}>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>Name*: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      placeholder="Enter name"
                      value={profileData?.user?.username}
                      name="username"
                      required
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            username: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>Email*: </p>
                    <input
                      type="email"
                      className={styles.rightDetailInputBox}
                      placeholder="Enter email"
                      value={profileData?.user?.email}
                      name="email"
                      required
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            email: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>Bio: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      placeholder="Write about you"
                      value={profileData?.user?.bio || ""}
                      name="bio"
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            bio: e.target.value,
                          },
                        });
                      }}
                    />
                    {errors?.bio && <p className={styles.errorText}>{errors?.bio}</p>}
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>Date of birth: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      value={profileData?.user?.dob}
                      name="dob"
                      placeholder="dd/mm/yyyy"
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            dob: e.target.value,
                          },
                        });
                      }}
                    />
                    {errors?.dob && <p className={styles.errorText}>{errors?.dob}</p>}
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>Street: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      placeholder="Enter street"
                      value={profileData?.user?.street}
                      name="street"
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            street: e.target.value,
                          },
                        });
                      }}
                    />
                     {errors?.street && <p className={styles.errorText}>{errors?.street}</p>}
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>City: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      placeholder="Enter city"
                      value={profileData?.user?.city}
                      name="city"
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            city: e.target.value,
                          },
                        });
                      }}
                    />
                    {errors?.city && <p className={styles.errorText}>{errors?.city}</p>}
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>State: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      placeholder="Enter state"
                      value={profileData?.user?.state}
                      name="state"
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            state: e.target.value,
                          },
                        });
                      }}
                    />
                    {errors?.state && <p className={styles.errorText}>{errors?.state}</p>}
                  </div>
                  <div className={styles.rightDetailContainer}>
                    <p className={styles.rightDetailHeading}>Country: </p>
                    <input
                      type="text"
                      className={styles.rightDetailInputBox}
                      placeholder="Enter country"
                      value={profileData?.user?.country}
                      name="country"
                      onChange={(e) => {
                        setProfileData({
                          ...profileData,
                          user: {
                            ...profileData.user,
                            country: e.target.value,
                          },
                        });
                      }}
                    />
                    {errors?.country && <p className={styles.errorText}>{errors?.country}</p>}
                  </div>
                </div>
                <button
                  className={styles.rightEditableFormSaveButton}
                  type="submit"
                >
                  {markFormSubmit ? (
                    <Spinner />
                  ) : (
                    <>
                      <Image
                        src={"/save-icon.png"}
                        width={20}
                        height={15}
                        alt="save icon"
                      />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
