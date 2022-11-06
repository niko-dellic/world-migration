import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useState } from "react";
import chapterData from "../public/data/mapChapters.json";
import { useEffect } from "react";
import StoryText from "../components/StoryText";

const DynamicMap = dynamic(() => import("../components/Map"), {
  suspense: true,
});
const DynamicStoryImages = dynamic(() => import("../components/StoryImages"), {
  suspense: true,
});

// getInitialProps({ ctx }) {
//   let isMobileView = (ctx.req
//     ? ctx.req.headers['user-agent']
//     : navigator.userAgent).match(
//       /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
//     )

//     //Returning the isMobileView as a prop to the component for further use.
//     return {
//       isMobileView: Boolean(isMobileView)
//     }
// }

export default function Home() {
  const [chapter, setChapter] = useState(0);

  // console log chapter on useEffect
  // useEffect(() => {
  //   console.log(chapter);
  // }, [chapter]);

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
        <StoryText chapter={chapter} />
        <Suspense fallback={"Loading..."}>
          <DynamicMap chapter={chapter} setChapter={setChapter} />
          <DynamicStoryImages chapter={chapter} />
        </Suspense>

        <nav id="navigation">
          <div onClick={previousChapter}>BACK</div>
          <div onClick={nextChapter}>NEXT</div>
        </nav>
      </main>
    </div>
  );
}
