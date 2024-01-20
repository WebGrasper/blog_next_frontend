import Image from "next/image";
import styles from '../styles/sidebar.module.css';

function SideBar(){
    return(
        <div className={`${styles.homePageSideBar}`}>
              <p className={styles.sideBarTitle}>Read like a Pro</p>
              <div className={styles.sideBarNotePoints}>
                <Image
                  src="/connectedIcon.png"
                  width={18}
                  height={18}
                  alt="connect icon"
                />
                <p>
                  Stay <span>connected</span>
                </p>
              </div>
              <div className={styles.sideBarNotePoints}>
                <Image
                  src="/updateIcon.png"
                  width={18}
                  height={18}
                  alt="update icon"
                />
                <p>
                  Stay <span>updated</span>
                </p>
              </div>
              <form action="#" method="post" className={styles.subscribeForm}>
                <input type="text" placeholder="Email address..." />
                <button type="submit">Subscribe</button>
              </form>
            </div>
    );
}

export default SideBar;
