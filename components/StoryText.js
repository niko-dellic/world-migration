import Typewriter from "typewriter-effect";
import { useState, useEffect } from "react";

export default function StoryText({ chapter }) {
  const [displayTitle, setDisplayTitle] = useState(true);

  useEffect(() => {
    if (chapter == 0) {
      setDisplayTitle(true);
    }
  }, [chapter]);
  return (
    <>
      <div id="narrativeImg"></div>
      <div
        id="narrativeContainer"
        style={{
          opacity: chapter == 0 ? "1" : "0",
          display: displayTitle ? "block" : "none",
        }}
        onTransitionEnd={(e) => {
          if (e.target.style.opacity == 0) {
            setDisplayTitle(false);
          }
        }}
      >
        {displayTitle && (
          <Typewriter
            options={{
              strings: [
                `<span id="narrativeText">DISTANCE UNKOWN</span><div id="subText">RISKS AND OPPORTUNITIES OF MIGRATION IN THE AMERICAS</div>`,
              ],
              autoStart: true,
              loop: true,
              delay: 75,
              cursor: "",
              pauseFor: 10000,
            }}
          />
        )}
        <div id="description"></div>
      </div>
    </>
  );
}
