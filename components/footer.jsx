import styles from "../styles/footer.module.css";
import Link from "next/link";

function Footer() {
  return (
    <div className={styles.footerSupremeContainer}>
      <div className={styles.footerMainContainer}>
        <div className={styles.container1}>
          <Link href={"/"}>
            <div className={styles.footerLogo}>
              <img src="/logo.png" alt="stashify logo" />
              <span>Web<span>Grasper</span></span>
            </div>
          </Link>
          <p className={styles.footerDescription}>
            Explore trending tech insights, programming tips, and top gadgets. Stay informed on comparisons, details, and discover the latest in technology.
          </p>
        </div>
        <div className={styles.container2}>
          <p className={styles.container2Heading}>Gadgets</p>
          <div className={styles.container2Links}>
            <Link href="/article-page?name=Gadgets-reviews" className={styles.links}>
              Reviews
            </Link>
            <Link href="/article-page?name=Gadgets-comparison" className={styles.links}>
              Comparison
            </Link>
          </div>
        </div>
        <div className={styles.container2}>
          <p className={styles.container2Heading}>Coding</p>
          <div className={styles.container2Links}>
            <Link href="/article-page?name=Problem-solving" className={styles.links}>
              Problem solving
            </Link>
            <Link href="/article-page?name=Frontend" className={styles.links}>
              Frontend
            </Link>
            <Link href="/article-page?name=Backend" className={styles.links}>
              Backend
            </Link>
          </div>
        </div>
        <div className={styles.container3}>
          <p className={styles.container3Heading}>Resources</p>
          <div className={styles.container3Links}>
            <Link href={"#"} className={styles.links}>
              Terms and conditions
            </Link>
            <Link href={"#"} className={styles.links}>
              About us
            </Link>
            <Link href={"#"} className={styles.links}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
      <section className={styles.section5}>
        <p>Copyright © 2024 MOHAMMAD AMAAN. All Rights Reserved.</p>
      </section>
    </div>
  );
}

export default Footer;
