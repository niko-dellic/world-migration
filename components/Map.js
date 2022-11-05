import DeckGL from "@deck.gl/react";
import { useState, useEffect } from "react";
import { BitmapLayer, GeoJsonLayer } from "@deck.gl/layers";
import { _GlobeView as GlobeView } from "@deck.gl/core";
import { FlyToInterpolator } from "@deck.gl/core";

import chapterData from "../public/data/mapChapters.json";

export default function Map({ chapter }) {
  const [viewState, setViewState] = useState({
    longitude: chapterData[0].longitude,
    latitude: chapterData[0].latitude,
    zoom: chapterData[0].zoom,
  });

  const layers = [
    new BitmapLayer({
      id: "bitmap-layer",
      // add bitmap image from public/image/ folder
      image: "/img/worldMap.jpg",
      bounds: [
        [-180, -90, -35000],
        [-180, 90, -35000],
        [180, 90, -35000],
        [180, -90, -35000],
      ],
      // opacity: chapterData[counter].worldTile,
      // transitions: {
      //   opacity: {
      //     duration: 2500,
      //     enter: (value) => [value[0], value[1], value[2], 0], // fade in
      //   },
      // },
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
