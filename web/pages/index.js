import Head from "next/head";
import swal from "sweetalert";
import styles from "../styles/Home.module.css";
import copy from "copy-to-clipboard";
import UrlsTable from "./components/UrlsTable";

export default function Home() {
  const addToLocalstorage = async (url) => {
    var existingEntries = JSON.parse(localStorage.getItem("shortenedUrls"));
    if (existingEntries == null) existingEntries = [];
    var entry = {
      url: url,
    };
    existingEntries.push(entry);
    localStorage.setItem("shortenedUrls", JSON.stringify(existingEntries));
  };

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

    const r = await res.json();
    if (res.status === 400) {
      swal({
        title: "Error while shortening your URL!",
        text: r.message,
        icon: "error",
        button: "Try Again!",
      })
        .then((value) => {
          if (value === "copy") copy(shortenedURL);
        })
        .catch((err) => {
          if (err) console.error(err);
        });
    } else {
      const shortenedURL = `${process.env.NEXT_PUBLIC_HTTP_OR_HTTPS}://${process.env.NEXT_PUBLIC_API_DOMAIN}/${r.id}`;
      addToLocalstorage(shortenedURL);
      swal({
        title: "Your URL was Successfully shortened!",
        text: shortenedURL,
        icon: "success",
        buttons: {
          copy: "Copy to Clipboard",
          ok: true,
        },
      })
        .then((value) => {
          if (value === "copy") copy(shortenedURL);
        })
        .catch((err) => {
          if (err) console.error(err);
        });
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>URL-Shortener</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>URL Shortener</h1>
        <div className={styles.grid}>
          <form onSubmit={shortenURL}>
            <label htmlFor="url">URL</label>
            <input
              id="url"
              name="url"
              type="text"
              placeholder="https://github.com/urento"
              autoComplete="url"
              required
            />
            <button type="submit">Shorten</button>
          </form>
          <UrlsTable />
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
