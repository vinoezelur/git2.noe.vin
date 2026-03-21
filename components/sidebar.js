'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Date from "./date";
import Header from "./sidebar_header";
import Footer from "./sidebar_footer";

export default function Sidebar() {
    const [allPostsData, setAllPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch posts data from API route
        fetch('/api/posts')
            .then((res) => res.json())
            .then((data) => {
                setAllPostsData(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch posts:', err);
                setLoading(false);
            });
    }, []);

    return (
        <aside className={styles.sidebar}>
            <Header />
            <nav className={styles.nav}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <ul className={styles.postList}>
                        {(Array.isArray(allPostsData) ? allPostsData.filter(Boolean) : []).map(({ id, date, title }) => (
                            <li key={id}>
                                <Link href={`/posts/${id}`} className={styles.postLink}>
                                    <div className={styles.postTitle}>{title}</div>
                                    {/* <div className={styles.postDate}>
                                        <Date dateString={date} />
                                    </div> */}
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
            <Footer />
        </aside>
    );
}
