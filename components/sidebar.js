'use client';

import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/sidebar.module.css";
import Header from "./sidebar_header";
import Footer from "./sidebar_footer";

export default function Sidebar() {
    const router = useRouter();
    const pathname = router.pathname;

    const categories = [
        { name: 'Blogs', path: '/blogs' },
        { name: 'Pics', path: '/pics' },
        { name: 'Doodles', path: '/doodles' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarStickyHeader}>
                <Header />
            </div>

            <nav className={styles.nav}>
                <ul className={styles.categoryList}>
                    {categories.map(({ name, path }) => {
                        const isActive = pathname === path;
                        return (
                            <li key={path}>
                                <Link
                                    href={path}
                                    className={`${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
                                >
                                    {name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className={styles.sidebarStickyFooter}>
                <Footer />
            </div>
        </aside>
    );
}
