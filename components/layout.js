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
                        content="Learn how to build a personal website using Next.js"
                    />
                    <meta name="og:title" content={siteTitle} />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <main>{children}</main>
                {!home && (
                    <div className={styles.backToHome}>
                        <Link href="/">← Back to home</Link>
                    </div>
                )}
            </div>
        </>
    );
}