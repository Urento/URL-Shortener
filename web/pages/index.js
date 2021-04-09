import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  const shortenURL = async (event) => {
    event.preventDefault();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_HTTP_OR_HTTPS}://${process.env.NEXT_PUBLIC_API_DOMAIN}:${process.env.NEXT_PUBLIC_API_PORT}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: event.target.url.value }),
      }
    );
    console.log(res.body.url);

    // handle errors from api

    const r = await res.json();
    console.log(r);
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a>URL Shortener</a>
        </h1>
        <div className={styles.grid}>
          <form onSubmit={shortenURL}>
            <label htmlFor="url">Name</label>
            <input
              id="url"
              name="url"
              type="text"
              autoComplete="url"
              required
            />
            <button type="submit">Shorten</button>
          </form>
        </div>
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
