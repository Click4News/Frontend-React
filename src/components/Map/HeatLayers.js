import React from "react";
import { Source, Layer } from "react-map-gl/mapbox";

const HeatLayers = ({ filteredData, clickedLocation, circleRadius }) => {
  const emptyGeoJSON = {
    type: "FeatureCollection",
    features: [],
  };

  return (
    <>
      {/* 🔥 Heatmap Layer */}
      <Source id="heatmap" type="geojson" data={filteredData || emptyGeoJSON}>
        <Layer
          id="heatmap-layer"
          type="heatmap"
          paint={{
            "heatmap-weight": 1,
            "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 1, 1, 10, 3],
            "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 2, 10, 10, 30],
            "heatmap-opacity": 0.9,
          }}
        />
      </Source>

      {/* 🌀 Click Circle Animation Layer */}
      {clickedLocation && (
        <Source
          id="circle-source"
          type="geojson"
          data={{
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [clickedLocation.longitude, clickedLocation.latitude],
                },
              },
            ],
          }}
        >
          <Layer
            id="circle-layer"
            type="circle"
            paint={{
              "circle-radius": circleRadius,
              "circle-color": "rgba(255, 255, 255, 0.3)",
              "circle-opacity": 0.4,
              "circle-stroke-width": 2,
              "circle-stroke-color": "rgba(255, 255, 255, 1)",
            }}
          />
        </Source>
      )}
    </>
  );
};

export default HeatLayers;
