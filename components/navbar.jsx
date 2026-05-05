import { useEffect, useState, useRef } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "@/store/authUISlice";
import { User, X } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // --- States ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isToken, setToken] = useState(false);
  const [isOffset, setOffset] = useState(false);
  const [isHome, setIsHome] = useState(true);
  const [atPortfolio, setAtPortfolio] = useState(false);

  // --- Logic Helpers ---
  const categories = [
    { name: "Politics", slug: "Politics" },
    { name: "India news", slug: "India-News" },
    { name: "International news", slug: "International-News" },
    { name: "Sports", slug: "Sports" },
    { name: "Technology", slug: "Technology" }
  ];

  const searchInputRef = useRef(null);

  const handleLinkClick = () => setMenuOpen(false);
  const handleSearchCheckBox = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchBlogs = debounce((title) => {
    if (title) {
      router.push(`/article-page?name=${title}`);
      setIsSearchOpen(false); // Close modal on search
    }
  }, 1000);

  const closeSearch = () => setIsSearchOpen(false);

  // --- Effects ---
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // --- Redux ---
  const profileState = useSelector((state) => state.profile);

  // --- Effects ---
  useEffect(() => {
    setIsHome(pathname === "/");
    setAtPortfolio(pathname === "/portfolio");
    setToken(!!Cookies.get("token"));
  }, [pathname, profileState.data]); // Added profileState.data to reactive dependencies

  useEffect(() => {
    const handleScroll = () => {
      setOffset(isHome && window.scrollY >= 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const activeModeClass = !isHome || isOffset ? styles.linkActiveOffset : "";

  return (
    <>
      <div className={`
        ${isHome ? styles.navbarSupremeContainer : styles.activeNotHomeNavbarSupremeContainer} 
        ${isOffset ? styles.activeOffset : ""} 
        ${atPortfolio ? styles.activeAtPortfolio : ""}
      `}>
        <nav className={styles.navbar}>
          {/* LOGO (LEFT) */}
          <div className={styles.container1}>
            <Link href="/">
              <div className={styles.container1H1}>
                <Image
                  src="https://ik.imagekit.io/94nzrpaat/images/gold-logo-with-title-wg_853558-2748-N6dN8fcsA-transformed_1%20(1).png?updatedAt=1708801310085"
                  alt="logo" width={70} height={35} priority
                />
                <span>Web<span>Grasper</span></span>
              </div>
            </Link>
          </div>

          {/* MIDDLE SECTION (Links on Desktop) */}
          <div className={styles.containerButton}>
            <input type="checkbox" className={styles.checkBox} checked={isMenuOpen} onChange={() => setMenuOpen(!isMenuOpen)} />
            <img className={styles.closeButton} src="/closeButtonBlack.svg" alt="close" />
            <img className={styles.menuButton} src="/menuButtonBlack.svg" alt="menu" />

            <div className={styles.container3Navbar}>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/article-page?name=${cat.slug}`} onClick={handleLinkClick}>
                  <span className={`${styles.link} ${activeModeClass}`}>{cat.name}</span>
                </Link>
              ))}
              {isToken && (
                <Link href="/profile" onClick={handleLinkClick}>
                  <span className={`${styles.link} ${activeModeClass}`}>My Stories</span>
                </Link>
              )}
            </div>
          </div>

          {/* ACTION SECTION (Far Right) */}
          <div className={styles.container2}>
            <div className={styles.searchTriggerUnit}>
              <input
                type="checkbox"
                className={styles.searchCheckBox}
                checked={isSearchOpen}
                onChange={handleSearchCheckBox}
              />
              <img className={styles.searchButton} src="/searchButtonBlack.svg" alt="search" />
              <img className={styles.searchCloseButton} src="/closeButtonBlack.svg" alt="close" />
            </div>

            <div className={styles.authTriggerContainer}>
              {!isToken ? (
                <button className={styles.iconButton} onClick={() => dispatch(openModal('login'))} title="Login">
                  <User size={24} color="#000" />
                </button>
              ) : (
                <Link href="/profile" className={styles.avatarLink}>
                  <img
                    src={profileState?.data?.user?.avatar || Cookies.get("avatar") || "https://ik.imagekit.io/94nzrpaat/images/resize.jpg"}
                    alt="profile" className={styles.navAvatar}
                  />
                </Link>
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* SEARCH OVERLAY (Full Screen Modal) moved outside to ensure blur works */}
      <div
        className={`${styles.bottomSearchBarContainer} ${isSearchOpen ? styles.show : ""}`}
        style={isSearchOpen ? {
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          background: "rgba(255, 255, 255, 0.15)"
        } : {}}
        onClick={closeSearch}
      >
        <form
          className={styles.searchForm}
          method="GET"
          onSubmit={(e) => {
            e.preventDefault();
            const value = searchInputRef.current?.value;
            if (value) handleSearchBlogs(value);
            closeSearch();
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            ref={searchInputRef}
            name="search"
            type="search"
            className={`${styles.bottomSearchBar}`}
            placeholder="Type your search..."
            onChange={(e) => handleSearchBlogs(e.target.value)}
          />
        </form>
      </div>
    </>
  );
}

export default Navbar;
