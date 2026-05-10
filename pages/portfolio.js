/* eslint-disable react/no-unescaped-entities */
// pages/index.js

import Head from "next/head";
import styles from "@/styles/portfolioHome.module.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import data from "../lib/data.json";
import SecondaryNavbar from "@/components/secondaryNavbar";

export default function Home({ data }) {
  const typeJsTextRef = useRef(null);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const textArray = ["Full Stack Developer.", "Make work Easy!"];
    let stringIndex = 0;
    let charIndex = 0;
    let isTyping = true;

    function typeJs() {
      if (stringIndex < textArray.length) {
        const currentString = textArray[stringIndex];

        if (isTyping) {
          if (charIndex < currentString.length) {
            setTypedText(prev => prev + currentString.charAt(charIndex));
            charIndex++;
          } else {
            isTyping = false;
          }
        } else {
          if (charIndex > 0) {
            setTypedText(prev => prev.substring(0, charIndex - 1));
            charIndex--;
          } else {
            isTyping = true;
            stringIndex = (stringIndex + 1) % textArray.length;
            charIndex = 0;
            setTypedText("");
          }
        }
      }
    }

    const intervalId = setInterval(typeJs, 100);
    return () => clearInterval(intervalId);
  }, []);


  // (Start) State to track the expanded project
  
  const [expandedProject, setExpandedProject] = useState(0);

  const handleProjectClick = (index) => {
    setExpandedProject((prev) => (prev === index ? index : index));
  }

  // (End) State to track the expanded project

  return (
    <div>
      <Head>
        <title>Mohammad Amaan | Full Stack Developer | Web Grasper | WebGrasper</title>
        <meta name="description" content="Meet Mohammad Amaan, a tech enthusiast pursuing undergrad studies. Aspiring Full Stack Developer, exploring innovation and programming. #TechPassion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta property="og:title" content="Mohammad Amaan | Full Stack Developer" />
        <meta property="og:description" content="Meet Mohammad Amaan, a tech enthusiast pursuing undergrad studies. Aspiring Full Stack Developer, exploring innovation and programming. #TechPassion" />
        <link rel="canonical" href="https://webgrasper.vercel.app/portfolio" />

        <meta property="og:image" content="https://webgrasper.vercel.app/favicon.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.jpg" />
      </Head>
      <SecondaryNavbar />
      <main className={styles.main}>
        <div className={styles.subMain}>
          <section className={styles.section1}>
            <div className={styles.section1Container1}>
              <p className={styles.name}>Hi, I'm Mohammad Amaan</p>
              <p className={styles.animatedText}>{typedText}</p>
            </div>
          </section>
          <section className={styles.section2} id="experience">
            <p className={styles.section2Heading}>
              <span>Experience</span>
            </p>
            <span className={styles.section2Container}>
              {data.experience.map((experience, index) => (
                <div key={index} className={styles.section2Item}>
                  <p className={styles.section1Container2Role}>
                    {experience.role}
                  </p>
                  <p className={styles.section1Container2CompanyName}>
                    {experience.companyName}
                  </p>
                  <p className={styles.section1Container2CompanyDate}>
                    {experience.period}
                  </p>
                </div>
              ))}
            </span>
          </section>
          <section className={styles.section3} id="technology">
            <p className={styles.section3Heading}>
              <span>Technology and Tool</span>
            </p>
            <div className={styles.section3Container}>
              {data.technology.map((tech, index) => (
                <Image
                  key={index}
                  src={tech.imgSrc}
                  alt={tech.alt || "Technology icon"}
                  width={40}
                  height={40}
                  className={styles.techIcon}
                />
              ))}
            </div>
          </section>
          <section className={styles.section4} id="projects">
            <p className={styles.section4Heading}>
              <span>Projects</span>
            </p>
            <div className={styles.section4Container}>
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className={`${styles.section4ProjectContainer} ${
                    expandedProject === index ? styles.expanded : ""
                  }`}
                  onClick={() => handleProjectClick(index)}
                >
                  <p className={styles.projectName}>{project.name}</p>
                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>
                  <Link href={project.link} className={styles.projectLink} target="_blank" rel="noopener noreferrer" passHref>
                    <Image src="/right_arrow.svg" alt="right arrow icon" width={24} height={24} />
                  </Link>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      data,
    },
  };
}
