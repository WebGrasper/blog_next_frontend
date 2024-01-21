/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce } from "lodash";

function Navbar() {

  const [isSeachChechBoxChecked, setSeachChechBoxChecked] = useState(false);

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
      className={styles.navbarSupremeContainer}
    >
      <div>
        <nav className={`${styles.navbar}`}>
          <div className={`${styles.container1}`}>
            <Link href={"/"}>
              <div className={styles.container1H1}>
                <img src="/logo.png" alt="stashify logo" />
                <span>tech<span>amaan</span></span>
              </div>
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
                src="/searchIcon.png"
                alt="search icon"
              />
              <img
                className={styles.searchCloseButton}
                src="/closeButton.png"
                alt="close button"
              />
            </div>
          </div>
          <div className={`${styles.containerButton}`}>
            <input type="checkbox" className={styles.checkBox} />
            <img
              className={styles.closeButton}
              src="/closeButton.png"
              alt="close button"
            />
            <img
              className={styles.menuButton}
              src="/menuButton.png"
              alt="menu button"
            />
            <div className={styles.container3Navbar}>
              <Link href="/gadgets-insights" passHref>
                <span className={styles.link}>Gadgets insights</span>
              </Link>
              <Link href="/stack-craft" passHref>
                <span className={styles.link}>Coding tutorials</span>
              </Link>
              <Link href="/portfolio" passHref>
                <span className={styles.link}>Portfolio</span>
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
