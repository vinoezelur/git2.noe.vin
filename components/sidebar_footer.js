import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "../styles/sidebar.module.css";
import Date from "./date";

export default function Footer() {
    return (
        <div>
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.siteLogo}>
                        <a href="/" target="_self" rel="noopener noreferrer">
                            <Image
                                src="https://res.cloudinary.com/drsaydxjd/image/upload/v1772963705/vinoe_logo.png"
                                height={20}
                                width={53}
                                alt="vinoe"
                            />
                        </a>
                    </div>
                    <div className={styles.instaLogo}>
                        <a href="https://instagram.com/vinoe.zelur" target="_blank" rel="noopener noreferrer">
                            <Image
                                src="https://res.cloudinary.com/drsaydxjd/image/upload/v1773229389/insta_logo.png"
                                height={20}
                                width={20}
                                alt="instagram"
                            />
                        </a>
                    </div>
                </div>
            </footer>
            <div className={styles.quoteSection}>
                <p className={styles.light}>yeah yeah yeah, Nietzsche didn't mean it that way. blah blah blah!</p>
            </div>
        </div>
    );
}
