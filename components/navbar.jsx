import { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce } from "lodash";

function Navbar() {
  //Functioning for Logout(Ended)

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;

        if (offset > 10) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleClickLink = () => {
    setMenuOpen(false);
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
      <nav className={styles.navbar}>
        <div className={styles.container1}>
          <h1 className={styles.container1H1}>
            <img src="/logo.png" alt="stashify logo" />
            Stash<span>ify</span>
          </h1>
        </div>
        <div className={styles.container2}>
          <form className={styles.container2Span} method="GET">
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
        </div>
        <div className={styles.containerButton}>
          <input
            type="checkbox"
            className={styles.checkBox}
            name="check"
            id="check"
            checked={isMenuOpen}
            onChange={handleMenuToggle}
          />
          <button className={`${styles.menuButton} material-symbols-outlined`}>
            menu
          </button>
          <button className={`${styles.closeButton} material-symbols-outlined`}>
            close
          </button>
          <div className={styles.container3}>
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
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
