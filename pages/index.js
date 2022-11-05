import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useState } from "react";
import Map from "../components/Map";

import chapterData from "../public/data/mapChapters.json";

export default function Home() {
  const [chapter, setChapter] = useState(0);

  // create a function to add +1 to chapter on click
  const nextChapter = () => {
    if (chapter < chapterData.length - 1) {
      setChapter(chapter + 1);
    } else {
      setChapter(0);
    }
  };

  const previousChapter = () => {
    if (chapter > 0) {
      setChapter(chapter - 1);
    } else {
      setChapter(chapterData.length - 1);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>World Migration</title>
        <meta
          name="description"
          content="Created by the Civic Data Design Lab at MIT"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Map chapter={chapter} />

        <nav id="navigation">
          <div onClick={previousChapter}>BACK</div>
          <div onClick={nextChapter}>NEXT</div>
        </nav>
      </main>
    </div>
  );
}
