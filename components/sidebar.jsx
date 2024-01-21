import Image from "next/image";
import styles from '../styles/sidebar.module.css';

function SideBar(){
    return(
        <div className={`${styles.homePageSideBar}`}>
              <h2 className={styles.sideBarTitle}>Read like a Pro</h2>
              <div className={styles.sideBarNotePoints}>
                <Image
                  src="/connectedIcon.png"
                  width={18}
                  height={18}
                  alt="connect icon"
                />
                <h3>
                  Stay <span>connected</span>
                </h3>
              </div>
              <div className={styles.sideBarNotePoints}>
                <Image
                  src="/updateIcon.png"
                  width={18}
                  height={18}
                  alt="update icon"
                />
                <h3>
                  Stay <span>updated</span>
                </h3>
              </div>
              <form action="#" method="post" className={styles.subscribeForm}>
                <input type="text" placeholder="Email address..." />
                <button type="submit">Subscribe</button>
              </form>
            </div>
    );
}

export default SideBar;
