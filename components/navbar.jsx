import { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce } from "lodash";

function Navbar() {
  //Functioning for Logout(Ended)

  const [isSticky, setIsSticky] = useState(false);
  const [isSeachChechBoxChecked, setSeachChechBoxChecked] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;

      if (offset > 5) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchCheckBox = () => {
    setSeachChechBoxChecked(!isSeachChechBoxChecked);
  };

  //search bar functionality(Started)

  const handleSearchBlogs = debounce(async (title) => {
    if (title === null) {
      // await dispatch(fetchBlogs());
      window.scrollTo(0, 0);
      return;
    }
    await dispatch(filterBlogs(title));
    window.scrollTo(0, 0);
  }, 1000);

  //search bar functionality(Ended)

  return (
    <div
      className={`${styles.navbarSupremeContainer} ${
        isSticky ? styles.isSticky : ""
      }`}
    >
      <div>
        <nav className={`${styles.navbar}`}>
          <div className={`${styles.container1}`}>
            <Link href={"/"}>
              <h1 className={styles.container1H1}>
                <img src="/logo.png" alt="stashify logo" />
                new<span>stash</span>
              </h1>
            </Link>
          </div>
          <div className={`${styles.container2}`}>
            <form className={`${styles.container2Span}`} method="GET">
              <input
                type="search"
                className={styles.container2SearchBox}
                id="container2SearchBox"
                placeholder="Ideas, topics & more..."
                onChange={(e) => {
                  handleSearchBlogs(e.target.value || null);
                }}
              />
            </form>
            <div className={`${styles.searchCheckBoxContainer}`}>
              <input
                type="checkbox"
                className={styles.searchCheckBox}
                onClick={handleSearchCheckBox}
              />
              <img
                className={styles.searchButton}
                src="/searchIcon.svg"
                alt="search icon"
              />
              <img
                className={styles.searchCloseButton}
                src="/closeButton.svg"
                alt="close button"
              />
            </div>
          </div>
          <div className={`${styles.containerButton}`}>
            <input type="checkbox" className={styles.checkBox} />
            <img
              className={styles.closeButton}
              src="/closeButton.svg"
              alt="close button"
            />
            <img
              className={styles.menuButton}
              src="/menuButton.svg"
              alt="menu button"
            />
            <div className={styles.container3Navbar}>
              <Link href="/dailypicks" passHref>
                <span className={styles.link}>Daily Picks</span>
              </Link>
              <Link href="/recommanded" passHref>
                <span className={styles.link}>Recommended</span>
              </Link>
              <Link href="/collections" passHref>
                <span className={styles.link}>Collections</span>
              </Link>
              <Link href="/portfolio" passHref>
                <span className={styles.link}>Portfolio</span>
              </Link>
              <Link href="/contact-us" passHref>
                <span className={styles.link}>Contact us</span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <form
        className={`${styles.buttomSearchBarContainer} ${
          isSeachChechBoxChecked ? styles.show : ""
        }`}
        method="GET"
      >
        <input
          type="search"
          className={styles.buttomSearchBar}
          id="container2SearchBox"
          placeholder="Ideas, topics & more..."
          onChange={(e) => {
            handleSearchBlogs(e.target.value || null);
          }}
        />
      </form>
    </div>
  );
}

export default Navbar;
