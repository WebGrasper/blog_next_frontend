/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce, replace } from "lodash";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function Navbar() {
  const [isSeachChechBoxChecked, setSeachChechBoxChecked] = useState(false);

  const handleSearchCheckBox = () => {
    setSeachChechBoxChecked(!isSeachChechBoxChecked);
  };

  // New state for menu visibility
  const [isMenuOpen, setMenuOpen] = useState(false);
  const handleLinkClick = () => {
    setMenuOpen(false);
  };
  // Close the menu when a link is clicked

  //search bar functionality(Started)
  const router = useRouter();
  const handleSearchBlogs = debounce(async (title) => {
    if (title !== null) {
      router.push(`/article-page?name=${title}`);
    }
  }, 1000);

  //search bar functionality(Ended)

  const [isOffset, setOffset] = useState(false);
  const [isHome, setIsHome] = useState(true);

  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== "/") {
      setIsHome(false);
    } else {
      setIsHome(true);
    }
    console.log(isHome);
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (isHome && window.scrollY >= window.innerHeight - 80) {
        setOffset(true);
      } else {
        setOffset(false);
      }
    });
  });

  const [atPortfolio, setAtPortfolio] = useState(false);
  useEffect(() => {
    if (pathname === "/portfolio") {
      setAtPortfolio(true);
    } else {
      setAtPortfolio(false);
    }
  });

  //Check for token presence
  const [isToken, setToken] = useState(false);
  useEffect(() => {
    if (Cookies.get("token")) {
      setToken(true);
    } else {
      setToken(false);
    }
  },[Cookies.get("token")]);

  return (
    <div
      className={`${
        isHome
          ? styles.navbarSupremeContainer
          : styles.activeNotHomeNavbarSupremeContainer
      } ${isOffset ? styles.activeOffset : ""} ${
        atPortfolio ? styles.activeAtPortfolio : ""
      }`}
    >
      <div>
        <nav className={`${styles.navbar}`}>
          <div className={`${styles.container1}`}>
            <Link href={"/"}>
              <div className={styles.container1H1}>
                <Image
                  src="https://ik.imagekit.io/94nzrpaat/images/gold-logo-with-title-wg_853558-2748-N6dN8fcsA-transformed_1%20(1).png?updatedAt=1708801310085"
                  alt="logo"
                  width={70}
                  priority={true}
                  height={35}
                />
                <span>
                  Web<span>Grasper</span>
                </span>
              </div>
            </Link>
          </div>
          <div className={`${styles.container2}`}>
            <input
              type="checkbox"
              className={styles.searchCheckBox}
              onClick={handleSearchCheckBox}
            />
            <img
              className={styles.searchButton}
              src={`${
                !isHome || isOffset
                  ? "/searchButtonBlack.svg"
                  : "/searchButtonWhite.svg"
              }`}
              fetchPriority="high"
              alt="search icon"
            />
            <img
              className={styles.searchCloseButton}
              src={`${
                !isHome || isOffset
                  ? "/closeButtonBlack.svg"
                  : "/closeButtonWhite.svg"
              }`}
              fetchPriority="high"
              alt="close button"
            />
          </div>
          <div className={`${styles.containerButton}`}>
            <input
              type="checkbox"
              className={styles.checkBox}
              checked={isMenuOpen}
              onChange={() => setMenuOpen(!isMenuOpen)}
            />
            <img
              className={styles.closeButton}
              src="/closeButtonBlack.svg"
              alt="close button"
              fetchPriority="high"
            />
            <img
              className={styles.menuButton}
              src={`${
                !isHome || isOffset
                  ? "/menuButtonBlack.svg"
                  : "/menuButtonWhite.svg"
              }`}
              fetchPriority="high"
              alt="menu button"
            />
            <div className={styles.container3Navbar}>
              <Link
                href="/article-page?name=Problem-solving"
                passHref
                onClick={handleLinkClick}
              >
                <span
                  className={`${styles.link} ${
                    !isHome || isOffset ? styles.linkActiveOffset : ""
                  }`}
                >
                  Problem solving
                </span>
              </Link>
              <Link
                href="/article-page?name=Gadgets-reviews"
                passHref
                onClick={handleLinkClick}
              >
                <span
                  className={`${styles.link} ${
                    !isHome || isOffset ? styles.linkActiveOffset : ""
                  }`}
                >
                  Gadgets reviews
                </span>
              </Link>
              <Link
                href="/article-page?name=Gadgets-comparison"
                passHref
                onClick={handleLinkClick}
              >
                <span
                  className={`${styles.link} ${
                    !isHome || isOffset ? styles.linkActiveOffset : ""
                  }`}
                >
                  Gadgets comparison
                </span>
              </Link>
              <Link href="/portfolio" passHref onClick={handleLinkClick}>
                <span
                  className={`${styles.link} ${
                    !isHome || isOffset ? styles.linkActiveOffset : ""
                  }`}
                >
                  Portfolio
                </span>
              </Link>
              <Link href="/login" passHref onClick={handleLinkClick}>
                <span
                  className={`${styles.profileButton} ${
                    !isHome || isOffset ? styles.profileButtonActiveOffset : ""
                  }`}
                >
                  {isToken ? <>Profile</> : <>Login</>}
                </span>
              </Link>
            </div>
          </div>
        </nav>
      </div>
      <form
        className={`${styles.bottomSearchBarContainer} ${
          isSeachChechBoxChecked ? styles.show : ""
        }`}
        method="GET"
      >
        <input
          type="search"
          className={`${styles.bottomSearchBar} ${
            !isHome || isOffset ? styles.activeBottomSearchBar : ""
          }`}
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
