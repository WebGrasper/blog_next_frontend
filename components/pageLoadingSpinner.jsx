import styles from "@/styles/page-loading-spinner.module.css";

const PLSpinner = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default PLSpinner;
