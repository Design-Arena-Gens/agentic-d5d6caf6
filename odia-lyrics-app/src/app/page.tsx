"use client";

import { FormEvent, useState } from "react";
import styles from "./page.module.css";

const LENGTH_OPTIONS = [
  { id: "short", label: "ଛୋଟ", detail: "8 ଲାଇନ", lines: 8 },
  { id: "medium", label: "ମଝିଆଁ", detail: "12 ଲାଇନ", lines: 12 },
  { id: "long", label: "ଦୀର୍ଘ", detail: "16 ଲାଇନ", lines: 16 },
];

type LyricsResponse = {
  lines: string[];
};

export default function Home() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState<string>("medium");
  const [lyrics, setLyrics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic.trim()) {
      setError("ଦୟାକରି ଏକ ବିଷୟ ଲେଖନ୍ତୁ।");
      return;
    }
    setIsLoading(true);
    setError(null);
    setLyrics([]);
    setCopied(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, length }),
      });

      if (!response.ok) {
        throw new Error("Generating lyrics failed");
      }

      const data = (await response.json()) as LyricsResponse;
      setLyrics(data.lines);
    } catch {
      setError("ଲିରିକ୍ସ ତିଆରି କରିବାରେ ସମସ୍ୟା ହେଲା। ପୁନଃ ଚେଷ୍ଟା କରନ୍ତୁ।");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!lyrics.length) return;
    try {
      await navigator.clipboard.writeText(lyrics.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("କପି କରିପାରିଲା ନାହିଁ, ସ୍ୱୟଂ କପି କରନ୍ତୁ।");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.hero}>
          <h1>ଓଡ଼ିଆ ଗୀତ ଲିରିକ୍ସ ଜେନେରେଟର</h1>
          <p>
            ବିଷୟ ବାଛନ୍ତୁ, ଲମ୍ବ ବିନ୍ୟାସ କରନ୍ତୁ, ଏବଂ ନୂତନ ଗୀତ ଲିରିକ୍ସ
            ପ୍ରାପ୍ତ କରନ୍ତୁ।
          </p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            ବିଷୟ / ଥିମ୍
            <input
              type="text"
              placeholder="ଯେପରିକି — ପ୍ରେମ, ପର୍ବ, ଜୀବନ"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            />
          </label>

          <fieldset className={styles.lengthSelector}>
            <legend>ଗୀତର ଲମ୍ବ</legend>
            <div className={styles.lengthOptions}>
              {LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`${styles.lengthOption} ${
                    option.id === length ? styles.lengthOptionActive : ""
                  }`}
                  onClick={() => setLength(option.id)}
                >
                  <span className={styles.lengthLabel}>{option.label}</span>
                  <span className={styles.lengthDetail}>{option.detail}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <button className={styles.submitButton} type="submit" disabled={isLoading}>
            {isLoading ? "ଲେଖାଯାଉଛି..." : "ଗୀତ ତିଆରି କରନ୍ତୁ"}
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

        {lyrics.length > 0 && (
          <section className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <h2>ନୂତନ ଲିରିକ୍ସ</h2>
              <button onClick={handleCopy} className={styles.copyButton}>
                {copied ? "କପି ହୋଇଗଲା ✅" : "ଲିରିକ୍ସ କପି କରନ୍ତୁ"}
              </button>
            </div>
            <ul className={styles.lyricsList}>
              {lyrics.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <footer className={styles.footer}>
        <p>ଓଡ଼ିଆ ସଙ୍ଗୀତର ପ୍ରେରଣାରେ ଏକ ଛୋଟ ପ୍ରୟାସ।</p>
      </footer>
    </div>
  );
}
