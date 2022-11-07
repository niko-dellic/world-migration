import chapterData from "../public/data/mapChapters.json";
import Image from "next/image";

// import multiple svgs from "../public/svg/narrative/mapOverlay/"
import DarienCAD from "../public/svg/mapOverlay/darienCAD.svg";
import PanamaCAD from "../public/svg/mapOverlay/PanamaCAD.svg";
import GuatMexCAD from "../public/svg/mapOverlay/GuatMexCAD.svg";

// import svg narrative
import Text1 from "../public/svg/narrativeText/01.svg";
import Text2 from "../public/svg/narrativeText/02.svg";
import Text3 from "../public/svg/narrativeText/03.svg";
import Text4 from "../public/svg/narrativeText/04.svg";
import Text5 from "../public/svg/narrativeText/05.svg";
import Text6 from "../public/svg/narrativeText/06.svg";
import Text7 from "../public/svg/narrativeText/07.svg";
import Text8 from "../public/svg/narrativeText/08.svg";

export default function StoryImages({ chapter }) {
  // add a condition with a buffer one before and one after the specific image chapter

  const svgStyle = {
    width: "100%",
  };

  return (
    <div
      className="story-image-container"
      style={{
        opacity:
          chapterData[chapter].imageUrl != "" ||
          chapterData[chapter].svgOverlay != null
            ? 1
            : 0,
      }}
    >
      {chapterData[chapter].svgOverlay == "Text1" && <Text1 />}
      {chapterData[chapter].svgOverlay == "Text2" && <Text2 />}
      {chapterData[chapter].svgOverlay == "Text3" && <Text3 />}
      {chapterData[chapter].svgOverlay == "Text4" && <Text4 />}
      {chapterData[chapter].svgOverlay == "Text5" && <Text5 />}
      {chapterData[chapter].svgOverlay == "Text6" && <Text6 />}
      {chapterData[chapter].svgOverlay == "Text7" && <Text7 />}
      {chapterData[chapter].svgOverlay == "Text8" && <Text8 />}
      {chapterData[chapter].svgOverlay == "darienCAD" && (
        <DarienCAD style={svgStyle} />
      )}
      {chapterData[chapter].svgOverlay == "panamaCAD" && (
        <PanamaCAD style={svgStyle} />
      )}
      {chapterData[chapter].svgOverlay == "guatMexCAD" && (
        <GuatMexCAD style={svgStyle} />
      )}
      {chapterData[chapter].imageUrl !== "" && (
        <Image
          src={`/img/story/${chapterData[chapter].imageUrl}`}
          alt="Picture of the author"
          fill={true}
        />
      )}
    </div>
  );
}
