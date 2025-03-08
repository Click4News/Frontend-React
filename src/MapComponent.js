import React, {Component} from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

// Public Token Taken From
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiaGltYXZhcnNoaXRoNzc3IiwiYSI6ImNtNzZsZHBnZjA5NGoya285MXRybG0ycW0ifQ.zzE8yJ1AcOhd_Qe5CGs0SQ"; // Replace with your actual token

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: this.generateRandomLocations(500), // Generate 50 random points in India
    };
  }

  // Generate random locations only within India
  generateRandomLocations = (count) => {
    const locations = [];
    for (let i = 0; i < count; i++) {
      let longitude = (Math.random() * 100).toFixed(6); // Longitude in India (68 to 97)
      let latitude = (Math.random() * 40).toFixed(6); // Latitude in India (8 to 37)

      locations.push({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) });
    }
    return locations;
  };

  render() {
    const { points } = this.state;

    // Convert points to GeoJSON format for heatmap
    const geoJsonData = {
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [point.longitude, point.latitude],
        },
      })),
    };

    return (
      <Map
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: 78.9629, // Center on India
          latitude: 20.5937,
          zoom: 4, // Adjusted zoom to fit India
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="mapbox://styles/mapbox/dark-v11" // Dark theme
        projection={{ name: "globe" }} // Enables 3D globe projection
      >
        {/* Heatmap Source */}
        <Source id="heatmap" type="geojson" data={geoJsonData}>
          <Layer
            id="heatmap-layer"
            type="heatmap"
            paint={{
              "heatmap-weight": 1, // Weight of each point
              "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 1, 1, 10, 3], // Controls intensity with zoom
              "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 2, 10, 10, 30], // Radius of heatmap points
              "heatmap-opacity": 0.9, // Slightly more opaque
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(0,0,255,0)",   // Invisible at low density
                0.2, "rgba(0,128,255,0.5)",  // Light blue
                0.4, "rgba(0,255,128,0.7)",  // Aqua green
                0.6, "rgba(255,255,0,0.8)",  // Yellow
                0.8, "rgba(255,128,0,0.9)",  // Orange
                1, "rgba(255,0,0,1)"  // Red (High Density)
              ],
            }}
          />
        </Source>
      </Map>
    );
  }
}

export default HeatMap;