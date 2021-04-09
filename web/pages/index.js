import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>URL Shortener</a>
        </h1>
        <div className={styles.grid}></div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/Urento/URL-Shortener"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/github_logo.png"
            alt="Vercel Logo"
            className={styles.logo}
          />
        </a>
      </footer>
    </div>
  );
}
