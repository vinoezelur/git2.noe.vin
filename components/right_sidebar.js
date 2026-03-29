'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/sidebar.module.css";

export default function RightSidebar({ category }) {
    const router = useRouter();
    const [allPostsData, setAllPostsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeHash, setActiveHash] = useState('');

    useEffect(() => {
        if (!category) {
            setLoading(false);
            return;
        }

        fetch(`/api/posts?category=${category}`)
            .then((res) => res.json())
            .then((data) => {
                setAllPostsData(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch posts:', err);
                setLoading(false);
            });
    }, [category]);

    useEffect(() => {
        const handleHashChange = () => {
            setActiveHash(window.location.hash.slice(1));
        };

        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (!category) {
        return null;
    }

    return (
        <aside className={`${styles.sidebar} ${styles.rightSidebar}`}>
            <nav className={styles.nav}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <ul className={styles.postList}>
                        {(Array.isArray(allPostsData) ? allPostsData.filter(Boolean) : []).map(({ id, title }) => {
                            const isActive = activeHash === id;
                            return (
                                <li key={id}>
                                    <a
                                        href={`#${id}`}
                                        className={`${styles.postLink} ${isActive ? styles.activePostLink : ''}`}
                                    >
                                        <div className={styles.postTitle}>{title}</div>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </nav>
        </aside>
    );
}