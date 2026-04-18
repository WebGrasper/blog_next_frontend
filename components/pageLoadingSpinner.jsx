import styles from "@/styles/page-loading-spinner.module.css";
import Spinner from "./spinner";

const PLSpinner = () => {
  return (
    <div className={styles.container} style={{
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      background: "rgba(0, 0, 0, 0.1)"
    }}>
      <Spinner />
    </div>
  );
};

export default PLSpinner;
