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
              <span>tech<span>amaan</span></span>
            </div>
          </Link>
          <p className={styles.footerDescription}>
            Explore insightful articles on tech, lifestyle, and more. Stay
            informed, share thoughts, and enrich your knowledge. Join our
            community now for engaging content!
          </p>
        </div>
        <div className={styles.container2}>
          <p className={styles.container2Heading}>Content</p>
          <div className={styles.container2Links}>
            <Link href={"#"} className={styles.links}>
              Ideas
            </Link>
            <Link href={"#"} className={styles.links}>
              Collections
            </Link>
            <Link href={"#"} className={styles.links}>
              Stories
            </Link>
          </div>
        </div>
        <div className={styles.container3}>
          <p className={styles.container3Heading}>Resources</p>
          <div className={styles.container3Links}>
            <Link href={"#"} className={styles.links}>
              Terms
            </Link>
            <Link href={"#"} className={styles.links}>
              Privacy
            </Link>
            <Link href={"#"} className={styles.links}>
              About
            </Link>
            <Link href={"#"} className={styles.links}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
