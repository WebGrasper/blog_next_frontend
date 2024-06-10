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
              <span>
                Web<span>Grasper</span>
              </span>
            </div>
          </Link>
          <p className={styles.footerDescription}>
            Explore trending tech insights, programming tips, and top gadgets.
            Stay informed on comparisons, details, and discover the latest in
            technology.
          </p>
        </div>
        <div className={styles.container2}>
          <p className={styles.container2Heading}>General</p>
          <div className={styles.container2Links}>
            <Link href="/article-page?name=Politics" className={styles.links}>
              Politics
            </Link>
            <Link href="/article-page?name=Technology" className={styles.links}>
              Technology
            </Link>
            <Link href="/article-page?name=Cricket" className={styles.links}>
              Cricket
            </Link>
            <Link href="/article-page?name=Railway" className={styles.links}>
              Railway
            </Link>
          </div>
        </div>
        <div className={styles.container2}>
          <p className={styles.container2Heading}>Finance</p>
          <div className={styles.container2Links}>
            <Link
              href="/article-page?name=Stocks"
              className={styles.links}
            >
              Stocks
            </Link>
            <Link
              href="/article-page?name=Crypto"
              className={styles.links}
            >
              Crypto
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
            <Link href={"/portfolio"} className={styles.links} target="_blank">
              Developer Portfolio
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
