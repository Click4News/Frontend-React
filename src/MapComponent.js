import React, { Component, createRef } from "react";
import Map, { Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "./MapFilters"; // Import filter component

// Public Token Taken From
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: this.generateRandomLocations(250), // Generate points
      theme: "light", // Default theme
      zoomLevel: "world", // Default zoom level
      viewState: {
        longitude: -105.2705, // Default center (USA-Boulder)
        latitude: 40.0150,
        zoom: 2,
      },
    };
    this.mapRef = createRef(); // Reference to Mapbox instance
  }

  // Define Zoom Levels (Only Affects Zoom, Not Center)
  zoomLevels = {
    world: 2, // World (Default)
    country: 4, // Country Level
    state: 6, // State Level
    city: 10, // City Level
  };

  // Generate random locations (for testing)
  generateRandomLocations = (count) => {
    const locations = [];
    for (let i = 0; i < count; i++) {
      let longitude = (Math.random() * (-80.0 + 114.0) - 110.0).toFixed(6);
      let latitude = (Math.random() * (45.0 - 28.0) + 30.0).toFixed(6);
      locations.push({ longitude: parseFloat(longitude), latitude: parseFloat(latitude) });
    }
    return locations;
  };

  // Handle Theme Change
  handleThemeChange = (theme) => {
    this.setState({ theme });
  };

  // Handle Zoom Level Change (Smooth Zoom)
  handleZoomChange = (selectedZoom) => {
    this.setState({ zoomLevel: selectedZoom });

    if (this.mapRef.current) {
      this.mapRef.current.flyTo({
        zoom: this.zoomLevels[selectedZoom],
        essential: true, // Ensures smooth animation
        duration: 1000, // Smooth transition in 1 second
      });
    }
  };

  render() {
    const { points, theme, viewState, zoomLevel } = this.state;

    // Map styles based on theme
    const mapStyles = {
      light: "mapbox://styles/mapbox/outdoors-v12",
      dark: "mapbox://styles/mapbox/dark-v11",
    };

    // Convert Points to GeoJSON Format
    const geoJsonData = {
      type: "FeatureCollection",
      features: points.map((point) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [point.longitude, point.latitude] },
      })),
    };

    return (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        {/* Filters Panel */}
        <MapFilters
          theme={theme}
          zoomLevel={zoomLevel}
          onThemeChange={this.handleThemeChange}
          onZoomChange={this.handleZoomChange}
        />

        {/* Map Component */}
        <Map
          ref={this.mapRef} // Reference for flyTo()
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={viewState} // Start at USA
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapStyles[theme]} // Dynamic Theme
        >
          {/* Heatmap Source */}
          <Source id="heatmap" type="geojson" data={geoJsonData}>
            <Layer
              id="heatmap-layer"
              type="heatmap"
              paint={{
                "heatmap-weight": 1,
                "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 1, 1, 10, 3],
                "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 2, 10, 10, 30],
                "heatmap-opacity": 0.9,
                "heatmap-color": [
                  "interpolate",
                  ["linear"],
                  ["heatmap-density"],
                  0, "rgba(0,0,255,0)",
                  0.2, "rgba(0,128,255,0.5)",
                  0.4, "rgba(0,255,128,0.7)",
                  0.6, "rgba(255,255,0,0.8)",
                  0.8, "rgba(255,128,0,0.9)",
                  1, "rgba(255,0,0,1)"
                ],
              }}
            />
          </Source>
        </Map>
      </div>
    );
  }
}

const styles = {
  popupContainer: {
    width: "300px",
    backgroundColor: "#1a1a1a", // Dark mode background
    padding: "15px",
    borderRadius: "8px",
    // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)", // Smooth shadow
    textAlign: "left",
    color: "#ffffff",
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#ffcc00", // Yellowish-gold color
  },
  popupSummary: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#cccccc",
    marginBottom: "10px",
  },
  readMoreButton: {
    width: "100%",
    padding: "8px",
    backgroundColor: "#ffcc00",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },

};
export default HeatMap;
