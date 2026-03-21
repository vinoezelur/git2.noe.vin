

import styles from "../styles/sidebar.module.css";
export default function Header() {
    return (
        <div className={styles.quoteSection}>
            <p className={styles.heavy}>And if thou gaze long into an abyss, the abyss will also gaze into thee.</p>
            <p className={styles.author}>Nietzsche</p>
            <p className={styles.light}>here in lies, most of the pebbles i had gathered, when i whiled away abyss-gazing</p>
        </div>
    );
}