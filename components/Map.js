import DeckGL from "@deck.gl/react";
import { useState, useEffect, useMemo } from "react";
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

// get chapter of the first time a layer is visible on the map
const layerAppearance = () => {
  let layerOrder = {};
  for (let i = 0; i < chapterData.length; i++) {
    if (chapterData[i].layers) {
      const layerKeys = Object.keys(chapterData[i].layers);
      for (let j = 0; j < layerKeys.length; j++) {
        if (
          chapterData[i].layers[layerKeys[j]] == 1 &&
          layerOrder[layerKeys[j]] == undefined
        ) {
          layerOrder[layerKeys[j]] = i;
        }
      }
    }
  }
  return layerOrder;
};

const loadLayerOrder = layerAppearance();

export default function Map({ chapter }) {
  const [viewState, setViewState] = useState({
    longitude: chapterData[0].longitude,
    latitude: chapterData[0].latitude,
    zoom: chapterData[0].zoom,
  });

  // hooks for trips layer
  const [time, setTime] = useState(0);
  const [animation] = useState({});
  const animate = () => {
    setTime((t) => (t + animationSpeed) % loopLength);
    animation.id = window.requestAnimationFrame(animate);
  };

  useEffect(() => {
    animation.id = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animation.id);
  }, [animation]);

  //   hooks for animated arc layer
  //   const [isPlaying, setIsPlaying] = useState(false);
  //   const [currentTime, setCurrentTime] = useState(0);
  //   const groups = useMemo(() => sliceData(data), [data]);
  //   const endTime = useMemo(() => {
  //     return groups.reduce((max, group) => Math.max(max, group.endTime), 0);
  //   }, [groups]);
  //   const timeRange = [currentTime, currentTime + TIME_WINDOW];

  const [layers, setLayers] = useState([
    new BitmapLayer({
      id: "bitmap-layer",
      image: DATA_URL.IMAGE.WORLD,
      bounds: [
        [-180, -90, -35000],
        [-180, 90, -35000],
        [180, 90, -35000],
        [180, -90, -35000],
      ],
      opacity: chapterData[chapter].layers.worldTile,
      transitions: {
        opacity: {
          duration: 2500,
          enter: (value) => [value[0], value[1], value[2], 0], // fade in
        },
      },
    }),
  ]);

  //   add layers on chapter change
  useEffect(() => {
    const incomingLayerNames = [];
    for (const [key, value] of Object.entries(loadLayerOrder)) {
      if (value == chapter) {
        incomingLayerNames.push(key);
      }
    }

    // add layers to the map if not added already
    const currentLayers = layers.map((layer) => layer.id);
    const layersToAdd = [];

    if (
      incomingLayerNames.includes("SaTile") &&
      !currentLayers.includes("SaTile")
    ) {
      layersToAdd.push(
        new BitmapLayer({
          id: "SaTile",
          image: DATA_URL.IMAGE.SOUTHAMERICA,
          bounds: [
            [-125.704377, -58.123691],
            [-125.704377, 37.286326],
            [-30.290414, 37.286326],
            [-30.290414, -58.123691],
          ],
          opacity: chapterData[chapter].layers.SaTile,
          transitions: {
            opacity: {
              duration: 2000,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("PanamPath") &&
      !currentLayers.includes("PanamPath")
    ) {
      layersToAdd.push(
        new PathLayer({
          id: "PanamPath",
          data: DATA_URL.DATA.PATH_COST,
          widthScale: 2,
          widthMinPixels: 2,
          getPath: (d) => d.path,
          getColor: [255, 255, 255, 255],
          getDashArray: [4, 5],
          dashJustified: false,
          extensions: [new PathStyleExtension({ highPrecisionDash: true })],
          opacity: chapterData[chapter].layers.PanamPath,
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("PanamaImg") &&
      !currentLayers.includes("PanamaImg")
    ) {
      layersToAdd.push(
        new BitmapLayer({
          id: "PanamaImg",
          image: DATA_URL.IMAGE.PANAMA,
          bounds: [
            [-84.071066, 6.204412],
            [-84.071066, 10.942168],
            [-75.646334, 10.942168],
            [-75.646334, 6.204412],
          ],
          opacity: chapterData[chapter].layers.PanamaImg,
          parameters: {
            depthTest: false,
          },
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("DarienImg") &&
      !currentLayers.includes("DarienImg")
    ) {
      layersToAdd.push(
        new BitmapLayer({
          id: "DarienImg",
          image: DATA_URL.IMAGE.DARIEN,
          bounds: [
            [-77.664696, 8.078343],
            [-77.664696, 8.789628],
            [-76.383324, 8.789628],
            [-76.383324, 8.078343],
          ],
          opacity: chapterData[chapter].layers.DarienImg,
          parameters: {
            depthTest: false,
          },
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }
    if (
      incomingLayerNames.includes("GuatMexImg") &&
      !currentLayers.includes("GuatMexImg")
    ) {
      layersToAdd.push(
        new BitmapLayer({
          id: "GuatMexImg",
          image: DATA_URL.IMAGE.GUATMEX,
          bounds: [
            [-92.168185, 14.663715],
            [-92.168185, 14.692483],
            [-92.116985, 14.692483],
            [-92.116985, 14.663715],
          ],
          opacity: chapterData[chapter].layers.GuatMexImg,
          parameters: {
            depthTest: false,
          },
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("Highway") &&
      !currentLayers.includes("Highway")
    ) {
      layersToAdd.push(
        new PathLayer({
          id: "Highway",
          data: DATA_URL.DATA.HIGHWAY,
          widthScale: 3,
          widthMinPixels: 2,
          getPath: (d) => d.path,
          getColor: [155, 155, 155, 255],
          opacity: chapterData[chapter].layers.Highway,
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("Countries") &&
      !currentLayers.includes("Countries")
    ) {
      layersToAdd.push(
        new TextLayer({
          id: "Countries",
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
          opacity: chapterData[chapter].layers.Countries,
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("CostPath") &&
      !currentLayers.includes("CostPath")
    ) {
      layersToAdd.push(
        new TextLayer({
          id: "CostPath",
          data: DATA_URL.TEXT.COST,
          fontFamily: "SpeziaWide",
          pickable: false,
          getPosition: (d) => [d.x, d.y],
          getText: (d) => (d.Acum_Cost_ !== 0 ? d.Accum_cost : null),
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
          opacity: chapterData[chapter].layers.CostPath,
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => {
                return [value[0], value[1], value[2], 0];
              }, // fade in
            },
          },
        })
      );
    }

    if (
      incomingLayerNames.includes("Trips") &&
      !currentLayers.includes("Trips")
    ) {
      layersToAdd.push(
        new TripsLayer({
          id: "Trips",
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
          visible: chapterData[chapter].layers.Trips,
          //   opacity: chapterData[chapter].layers.Trips,
          parameters: {
            depthTest: false,
          },
          transitions: {
            opacity: {
              duration: fadeTransDuration,
              enter: (value) => [value[0], value[1], value[2], 0], // fade in
            },
          },
        })
      );
    }

    setLayers([...new Set(layers), ...layersToAdd]);
  }, [chapter]);

  //   const dataLayers = groups.map(
  //     (group, index) =>
  //       new AnimatedArcLayer({
  //         id: `flights-${index}`,
  //         data: group.flights,
  //         getSourcePosition: (d) => [d.lon2, d.lat2],
  //         getTargetPosition: (d) => [d.lon1, d.lat1],
  //         getSourceTimestamp: (d) => d.time1,
  //         getTargetTimestamp: (d) => d.time2,
  //         getTilt: (d) => d.tilt,
  //         getHeight: (d) => d.randHeight,
  //         getWidth: 1,
  //         timeRange,
  //         getTargetColor: [215, 215, 0, [25]],
  //         getSourceColor: [215, 215, 0, [25]],
  //         opacity: chapterData[counter].AnimatedArcs,
  //       })
  //   );

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
      layers={[layers]} //dataLayers
      views={new GlobeView()}
    />
  );
}
