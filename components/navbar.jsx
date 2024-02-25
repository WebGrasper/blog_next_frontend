/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";

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

  const [isAtPortfolio, setAtPortfolio] = useState(false);
  useEffect(()=>{
    window.addEventListener('scroll', () => {
      if(window.scrollY){
        setAtPortfolio(true);
      } else {
        setAtPortfolio(false);
      }
    });
  })

  const [isOffset, setOffset] = useState(false);
  useEffect(()=>{
    console.log(window.innerHeight);
    window.addEventListener('scroll', () => {
      if(window.scrollY >= (window.innerHeight - 80)){
        setOffset(true);
      } else {
        setOffset(false);
      }
    });
  })

  const pathname = usePathname();

  useEffect(()=>{
    console.log(typeof pathname)
    if (pathname == '/portfolio') {
      setAtPortfolio(true);
    } else {
      setAtPortfolio(false);
    }
  },[pathname]);
  
  return (
    <div
      className={`${styles.navbarSupremeContainer} ${isOffset ? styles.activeOffset : ""}`}
    >
      <div>
        <nav className={`${styles.navbar}`}>
          <div className={`${styles.container1}`}>
            <Link href={"/"}>
              <div className={styles.container1H1}>
                <img src="https://ik.imagekit.io/94nzrpaat/images/gold-logo-with-title-wg_853558-2748-N6dN8fcsA-transformed_1%20(1).png?updatedAt=1708801310085" alt="logo" />
                <span>Web<span>Grasper</span></span>
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
                src={isOffset ? "/searchButtonBlack.svg" : "/searchButtonWhite.svg"}
                alt="search icon"
              />
              <img
                className={styles.searchCloseButton}
                src={isOffset ? "/closeButtonBlack.svg" : "/closeButtonWhite.svg"}
                alt="close button"
              />
          </div>
          <div className={`${styles.containerButton}`}>
            <input type="checkbox" className={styles.checkBox} checked={isMenuOpen} onChange={() => setMenuOpen(!isMenuOpen)}/>
            <img
              className={styles.closeButton}
              src="/closeButtonBlack.svg"
              alt="close button"
            />
            <img
              className={styles.menuButton}
              src={isOffset ? "/menuButtonBlack.svg" : "/menuButtonWhite.svg"}
              alt="menu button"
            />
            <div className={styles.container3Navbar}>
              <Link href="/gadgets-insights" passHref onClick={handleLinkClick}>
                <span className={`${styles.link} ${isOffset ? styles.linkActiveOffset : ""}`}>Gadgets insights</span>
              </Link>
              <Link href="/stack-craft" passHref onClick={handleLinkClick}>
                <span className={`${styles.link} ${isOffset ? styles.linkActiveOffset : ""}`}>Coding tutorials</span>
              </Link>
              <Link href="/portfolio" passHref onClick={handleLinkClick}>
                <span className={`${styles.link} ${isOffset ? styles.linkActiveOffset : ""}`}>Portfolio</span>
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
          className={`${styles.bottomSearchBar} ${isOffset ? styles.activeBottomSearchBar : ""}`}
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
