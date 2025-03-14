import React, { Component, createRef } from "react";
import Map, { Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "./MapFilters"; // Import filter component

// Load Mapbox Token from .env
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      points: this.generateRandomLocations(250), // Generate points
      theme: "light", // Default theme
      zoomLevel: "world", // Default zoom level
      viewState: {
        longitude: -105.2705, // Default center (Boulder, CO)
        latitude: 40.0150,
        zoom: 2,
      },
      geoJsonData: null,  // Stores heatmap data
      clickedLocation: null, // Stores clicked coordinates
      circleRadius: 0, // Expanding circle effect
      showPopup: false, // Controls popup visibility
      selectedNews: null, // Stores nearest news for popup
    };
    this.mapRef = createRef(); // Reference to Mapbox instance
  }

  componentDidMount() {
    // Load GeoJSON news data
    fetch("/usa_heatmap_news_links.geojson")
      .then((response) => response.json())
      .then((data) => this.setState({ geoJsonData: data }))
      .catch((error) => console.error("Error loading GeoJSON:", error));
  }

  // Define Zoom Levels
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
        essential: true,
        duration: 1000,
      });
    }
  };

  // Handle Map Click (Find Nearest News)
  handleMapClick = (event) => {
    event.originalEvent.stopPropagation();
    const { lng, lat } = event.lngLat;

    if (!this.state.geoJsonData) return;

    // Find the nearest news point
    const closestNews = this.state.geoJsonData.features.reduce((prev, curr) => {
      const prevDist = Math.hypot(prev.geometry.coordinates[0] - lng, prev.geometry.coordinates[1] - lat);
      const currDist = Math.hypot(curr.geometry.coordinates[0] - lng, curr.geometry.coordinates[1] - lat);
      return currDist < prevDist ? curr : prev;
    });

    this.setState({
      clickedLocation: { longitude: lng, latitude: lat },
      selectedNews: closestNews,
      circleRadius: 5, // Start animation small
      showPopup: false, // Hide popup initially
    });

    // Start animation and delay popup appearance
    this.animateCircle(() => {
      this.setState({ showPopup: true });
    });
  };

  // Expanding Circle Animation
  animateCircle = (callback) => {
    let radius = 5;
    const interval = setInterval(() => {
      radius += 5;
      this.setState({ circleRadius: radius });

      if (radius > 50) { // Stop animation at max size
        clearInterval(interval);
        if (callback) callback(); // Show popup after animation
      }
    }, 50);
  };

  render() {
    const { points, theme, viewState, zoomLevel, geoJsonData, clickedLocation, circleRadius, selectedNews, showPopup } = this.state;

    // Map styles based on theme
    const mapStyles = {
      light: "mapbox://styles/mapbox/outdoors-v12",
      dark: "mapbox://styles/mapbox/dark-v11",
    };

    // Convert Points to GeoJSON Format
    const geoJsonPoints = {
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
          ref={this.mapRef}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={viewState}
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapStyles[theme]}
          onClick={this.handleMapClick}
        >
          {/* Heatmap Source */}
          <Source id="heatmap" type="geojson" data={geoJsonPoints}>
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

          {/* Click Animation Effect (Expanding Circle) */}
          {clickedLocation && (
            <Source id="circle-source" type="geojson" data={{
              type: "FeatureCollection",
              features: [{
                type: "Feature",
                geometry: { type: "Point", coordinates: [clickedLocation.longitude, clickedLocation.latitude] }
              }]
            }}>
              <Layer
                id="circle-layer"
                type="circle"
                paint={{
                  "circle-radius": circleRadius,
                  "circle-color": "rgba(255, 255, 255, 0.5)",
                  "circle-opacity": 0.5,
                  "circle-stroke-width": 2,
                  "circle-stroke-color": "rgba(255, 255, 255, 1)",
                }}
              />
            </Source>
          )}

          {/* News Popup */}
          {selectedNews && showPopup && (
            <Popup
              longitude={selectedNews.geometry.coordinates[0]}
              latitude={selectedNews.geometry.coordinates[1]}
              closeButton={false}
              closeOnClick={false}
            >
              <div style={styles.popupContainer}>
                <button
                  onClick={() => this.setState({ selectedNews: null, showPopup: false })}
                  style={styles.closeButton}
                >
                  ✕
                </button>
                <h3 style={styles.popupTitle}>{selectedNews.properties.title}</h3>
                <p style={styles.popupSummary}>{selectedNews.properties.summary}</p>
                <button
                  style={styles.readMoreButton}
                  onClick={() => window.open(selectedNews.properties.link, "_blank")}
                >
                  Read More
                </button>
              </div>
            </Popup>
          )}
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
