import DeckGL from "@deck.gl/react";
import { useState, useEffect } from "react";
import { TextLayer, PathLayer, BitmapLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import { FlyToInterpolator } from "@deck.gl/core";
import { PathStyleExtension } from "@deck.gl/extensions";

import chapterData from "../public/data/mapChapters.json";

// static variables
let fadeTransDuration = 1500;

const DATA_URL = {
  DATA: {
    TRIPS: "/data/PANAM-ULTIMATE.json", // eslint-disable-line
    PATH_COST: "/data/PANAM-NEW.json",
    HIGHWAY: "/data/Highway.json",
    SPRITE: "/svg/spriteSheet.png",
    SPRITE_MAP: "/svg/sprite.json",
  },
  IMAGE: {
    WORLD: "/img/worldMap.jpg",
    SOUTHAMERICA: "/img/southAmerica.jpg",
    PANAMA: "/img/Panama.jpg",
    DARIEN: "/img/Darien.jpg",
    GUATMEX: "/img/GuatMex.jpg",
  },
  TEXT: {
    COUNTRY: "/data/countryNames.json",
    COST: "/data/costLabels.json",
  },
};

// animation
const loopLength = 21000; // unit corresponds to the timestamp in source data
const animationSpeed = 1.5;

export default function Map({ chapter }) {
  const [time, setTime] = useState(0);

  const [viewState, setViewState] = useState({
    longitude: chapterData[0].longitude,
    latitude: chapterData[0].latitude,
    zoom: chapterData[0].zoom,
  });

  const [animation] = useState({});
  const animate = () => {
    setTime((t) => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  const layers = [
    new BitmapLayer({
      id: "bitmap-layer",
      image: DATA_URL.IMAGE.WORLD,
      bounds: [
        [-180, -90, -35000],
        [-180, 90, -35000],
        [180, 90, -35000],
        [180, -90, -35000],
      ],
      opacity: chapterData[chapter].worldTile,
      transitions: {
        opacity: {
          duration: 2500,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new BitmapLayer({
      id: "saBitmap",
      image: DATA_URL.IMAGE.SOUTHAMERICA,
      bounds: [
        [-125.704377, -58.123691],
        [-125.704377, 37.286326],
        [-30.290414, 37.286326],
        [-30.290414, -58.123691],
      ],
      opacity: chapterData[chapter].SaTile,
      transitions: {
        opacity: {
          duration: 2000,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new BitmapLayer({
      id: "panamaBitmap",
      image: DATA_URL.IMAGE.PANAMA,
      bounds: [
        [-84.071066, 6.204412],
        [-84.071066, 10.942168],
        [-75.646334, 10.942168],
        [-75.646334, 6.204412],
      ],
      opacity: chapterData[chapter].PanamaImg,
      parameters: {
        depthTest: false,
      },
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new BitmapLayer({
      id: "darienBitmap",
      image: DATA_URL.IMAGE.DARIEN,
      bounds: [
        [-77.664696, 8.078343],
        [-77.664696, 8.789628],
        [-76.383324, 8.789628],
        [-76.383324, 8.078343],
      ],
      opacity: chapterData[chapter].DarienImg,
      parameters: {
        depthTest: false,
      },
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new BitmapLayer({
      id: "GuatMexBitmap",
      image: DATA_URL.IMAGE.GUATMEX,
      bounds: [
        [-92.168185, 14.663715],
        [-92.168185, 14.692483],
        [-92.116985, 14.692483],
        [-92.116985, 14.663715],
      ],
      opacity: chapterData[chapter].GuatMexImg,
      parameters: {
        depthTest: false,
      },
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new PathLayer({
      id: "accumulatedCost",
      data: DATA_URL.DATA.PATH_COST,
      widthScale: 2,
      widthMinPixels: 2,
      getPath: (d) => d.path,
      getColor: [255, 255, 255, 255],
      getDashArray: [4, 5],
      dashJustified: false,
      extensions: [new PathStyleExtension({ highPrecisionDash: true })],
      opacity: chapterData[chapter].PanamPath,
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new PathLayer({
      id: "Highway",
      data: DATA_URL.DATA.HIGHWAY,
      widthScale: 3,
      widthMinPixels: 2,
      getPath: (d) => d.path,
      getColor: [155, 155, 155, 255],
      opacity: chapterData[chapter].Highway,
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new TextLayer({
      id: "text-country",
      data: DATA_URL.TEXT.COUNTRY,
      fontFamily: "SpeziaWide",
      pickable: false,
      getPosition: (d) => [d.lon1, d.lat1],
      getText: (d) => d.Nationality.toUpperCase(),
      getSize: 11,
      getColor: [180, 235, 190],
      getAngle: 180,
      getPixelOffset: [-5, -1],
      fontWeight: "bold",
      getTextAnchor: "end",
      getAlignmentBaseline: "bottom",
      billboard: false,
      opacity: chapterData[chapter].Countries,
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),

    new TextLayer({
      id: "text-layer-cost",
      data: DATA_URL.TEXT.COST,
      fontFamily: "SpeziaWide",
      pickable: false,
      getPosition: (d) => [d.x, d.y],
      getText: (d) => d.Accum_cost,
      getSize: 15,

      getColor: [255, 255, 255],
      getPixelOffset: [-5, -1],
      fontWeight: "bold",
      getTextAnchor: "end",
      getAlignmentBaseline: "bottom",
      billboard: true,
      parameters: {
        depthTest: false,
      },
      opacity: chapterData[chapter].CostPath,
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => {
            return [value[0], value[1], value[2], 0];
          }, // fade in
        },
      },
    }),

    new TripsLayer({
      id: "trips",
      data: DATA_URL.DATA.TRIPS,
      getPath: (d) => d.path,
      getTimestamps: (d) => d.timestamps,
      getColor: [215, 215, 0],
      opacity: 1,
      widthMinPixels: 8,
      // widthMaxPixels:3,
      capRounded: true,
      jointRounded: true,
      trailLength: 50,
      currentTime: time,
      shadowEnabled: false,
      fadeTrail: true,
      visible: chapterData[chapter].Trips,
      //   opacity: chapterData[chapter].Trips,
      parameters: {
        depthTest: false,
      },
      transitions: {
        opacity: {
          duration: fadeTransDuration,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),
  ];

  // useEffect on chapter to update viewState
  useEffect(() => {
    setViewState({
      longitude: chapterData[chapter].longitude,
      latitude: chapterData[chapter].latitude,
      zoom: chapterData[chapter].zoom,
      transitionDuration: chapterData[chapter].duration,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, [chapter]);

  return (
    <DeckGL
      initialViewState={viewState}
      controller={true}
      layers={layers}
      views={new GlobeView()}
    />
  );
}
