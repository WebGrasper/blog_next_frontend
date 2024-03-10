import styles from "@/styles/article.module.css";

const Renderer = (ptr, index) =>{
   return(
    ptr.selfClosing === "false" ? (
        <ptr.type
          className={styles[ptr.className]} 
          key={index}
        >
          {ptr.data}
        </ptr.type>
      ) : (
        <ptr.type
          className={styles[ptr.className]} 
          key={index}
        />
      )
   )
}

export default Renderer;