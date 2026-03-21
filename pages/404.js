// pages/404.js
import styles from '../styles/404.module.css';
import Image from "next/image";

export default function Custom404() {
    return (
        <div className={styles.container}>
            <div className={styles.box}>
                <h1 className={styles.title}>404 </h1>
                <h1 className={styles.subtitle}>
                    There's no f**king page like that here!
                </h1>
            </div>
            <footer className={styles.footer}>
                <Image
                    src="https://res.cloudinary.com/drsaydxjd/image/upload/v1772963705/vinoe_logo.png"
                    height={20}
                    width={53}
                    alt="vinoe"
                />
            </footer>
        </div>
        
    );
}