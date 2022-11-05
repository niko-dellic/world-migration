import chapterData from "../public/data/mapChapters.json";
import Image from "next/image";

export default function StoryImages({ chapter }) {
  return (
    <div className="story-image-container">
      {chapterData[chapter].imageUrl !== "" && (
        <Image
          src={`/img/story/${chapterData[chapter].imageUrl}`}
          alt="Picture of the author"
          fill={true}
          //   width={window.innerWidth}
          //   height={window.innerHeight}
        />
      )}
    </div>
  );
}
