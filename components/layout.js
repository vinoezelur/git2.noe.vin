import styles from "../styles/layout.module.css";
import utilStyles from '../styles/utils.module.css';
import Head from "next/head";
import Link from "next/link";
import Sidebar from "./sidebar";

const name = "vinoe";
export const siteTitle = "git2.noe.vin";
export default function Layout({ children, home }) {
    return (
        <>
            <Sidebar />
            <div className={styles.container}>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta
                        name="description"
                        content=".vinoe's personal portfolio and blog. built with next.js and markdown."
                    />
                    <meta name="og:title" content={siteTitle} />
                </Head>
                <main>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        {/* <Link href="/">← Back to home</Link> */}
                    </div>
                )}
            </div>
        </>
    );
}