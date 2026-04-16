import { useEffect, useState, useRef } from "react";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { debounce } from "lodash";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { openModal } from "@/store/authUISlice";
import { User, X } from "lucide-react";

function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  // --- States ---
  const [isSeachChechBoxChecked, setSeachChechBoxChecked] = useState(false);
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
    setSeachChechBoxChecked(!isSeachChechBoxChecked);
  };

  const handleSearchBlogs = debounce((title) => {
    if (title) {
      router.push(`/article-page?name=${title}`);
      setSeachChechBoxChecked(false); // Close modal on search
    }
  }, 1000);

  const closeSearch = () => setSeachChechBoxChecked(false);

  // --- Effects ---
  useEffect(() => {
    if (isSeachChechBoxChecked && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSeachChechBoxChecked]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // --- Effects ---
  useEffect(() => {
    setIsHome(pathname === "/");
    setAtPortfolio(pathname === "/portfolio");
    setToken(!!Cookies.get("token"));
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(isHome && window.scrollY >= 1);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  const activeModeClass = !isHome || isOffset ? styles.linkActiveOffset : "";

  return (
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
          </div>
        </div>

        {/* ACTION SECTION (Far Right) */}
        <div className={styles.container2}>
          <div className={styles.searchTriggerUnit}>
            <input 
              type="checkbox" 
              className={styles.searchCheckBox} 
              checked={isSeachChechBoxChecked}
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
                  src={Cookies.get("avatar") || "https://ik.imagekit.io/94nzrpaat/images/resize.jpg"} 
                  alt="profile" className={styles.navAvatar} 
                />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY (Full Screen Modal) */}
      <div 
        className={`${styles.bottomSearchBarContainer} ${isSeachChechBoxChecked ? styles.show : ""}`}
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
    </div>
  );
}

export default Navbar;
