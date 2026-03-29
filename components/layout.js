import styles from "../styles/layout.module.css";
import utilStyles from '../styles/utils.module.css';
import Head from "next/head";
import Link from "next/link";
import Sidebar from "./sidebar";
import RightSidebar from "./right_sidebar";

const name = "vinoe";
export const siteTitle = "git2.noe.vin";
export default function Layout({ children, home, category }) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                    name="description"
                    content=".vinoe's personal portfolio and blog. built with next.js and markdown."
                />
                <meta name="og:title" content={siteTitle} />
            </Head>
            <div className={styles.pageWrapper}>
                <Sidebar />
                <div className={styles.container}>
                    <main>{children}</main>
                    {!home && (
                        <div className={styles.backToHome}>
                            {/* <Link href="/">← Back to home</Link> */}
                        </div>
                    )}
                </div>
                <RightSidebar category={category} />
            </div>
        </>
    );
}