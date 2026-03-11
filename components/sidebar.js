'use client';

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Date from "./date";

export default function Sidebar() {
    const [allPostsData, setAllPostsData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch posts data from API route
        fetch('/api/posts')
            .then((res) => res.json())
            .then((data) => {
                setAllPostsData(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch posts:', err);
                setLoading(false);
            });
    }, []);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.quoteSection}>
                <p className={styles.heavy}>And if thou gaze long into an abyss, the abyss will also gaze into thee.</p>
                <p className={styles.author}>Nietzsche</p>
                <p className={styles.light}>here in lies, most of the pebbles i had gathered, when i whiled away abyss-gazing</p>
            </div>
            <nav className={styles.nav}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <ul className={styles.postList}>
                        {allPostsData.map(({ id, date, title }) => (
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
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.siteLogo}>
                        <Image
                            src="https://res.cloudinary.com/drsaydxjd/image/upload/v1772963705/vinoe_logo.png"
                            height={20}
                            width={53}
                            alt="vinoe logo"
                        />
                    </div>
                    <div className={styles.instaLogo}>
                        <a href="https://instagram.com/vinoe.zelur" target="_blank" rel="noopener noreferrer">
                            <Image
                                src="https://res.cloudinary.com/drsaydxjd/image/upload/v1773229389/insta_logo.png"
                                height={20}
                                width={20}
                                alt="insta logo"
                            />
                        </a>
                    </div>
                </div>
            </footer>
            <div className={styles.quoteSection}>
                <p className={styles.light}>yeah yeah yeah, Nietzsche didn't mean it that way. blah blah blah!</p>
            </div>
        </aside>
    );
}
