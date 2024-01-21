import { useEffect, useState } from "react";
import styles from "../styles/secondaryNavbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

function SecondaryNavbar() {
  //styling navbar link animation(starting)
  const router = useRouter();

  const [isAtHome, setAtHome] = useState(false);
  const [isAtExperience, setAtExperience] = useState(false);
  const [isAtTechnologies, setAtTechnologies] = useState(false);
  const [isAtProjects, setAtProjects] = useState(false);

  useEffect(() => {
    console.log(router.asPath)
    if (router.asPath == '/') {
      setAtHome(true);
    } else {
      setAtHome(false);
    }

    if (router.asPath == '/#experience') {
      setAtExperience(true);
    } else {
      setAtExperience(false);
    }

    if (router.asPath == '/#technology') {
      setAtTechnologies(true);
    } else {
      setAtTechnologies(false);
    }

    if (router.asPath == '/#projects') {
      setAtProjects(true);
    } else {
      setAtProjects(false);
    }

  }, [router.asPath]);
  //styling navbar link animation(Ended)

  return (
    <div className={styles.secondaryNavbarSupremeContainer}>
      <div className={`${styles.secondaryNavbarContainer}`}>
        <Link
          className={`${styles.secondaryNavbarLink} ${isAtHome ? styles.active : ""}`}
          href="/portfolio"
          passHref
          // onClick={handleLinkClick}
        >
          <span>Home</span>
        </Link>
        <Link
          className={`${styles.secondaryNavbarLink} ${isAtExperience ? styles.active : ""}`}
          href="/portfolio/#experience"
          passHref
          // onClick={handleLinkClick}
        >
          <span>Experience</span>
        </Link>
        <Link
          className={`${styles.secondaryNavbarLink} ${isAtTechnologies ? styles.active : ""}`}
          href="/portfolio/#technology"
          passHref
          // onClick={handleLinkClick}
        >
          <span>Technology</span>
        </Link>
        <Link
          className={`${styles.secondaryNavbarLink} ${isAtProjects ? styles.active : ""}`}
          href="/portfolio/#projects"
          passHref
          // onClick={handleLinkClick}
        >
          <span>Projects</span>
        </Link>
      </div>
    </div>
  );
}

export default SecondaryNavbar;
