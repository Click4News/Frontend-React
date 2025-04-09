import React, { Component, createRef } from "react";
import Map, { Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import MapFilters from "./MapFilters";

// 🔧 Load token from .env
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "light",
      zoomLevel: "world",
      viewState: {
        longitude: -105.2705,
        latitude: 40.015,
        zoom: 2,
      },
      geoJsonData: null,
      clickedLocation: null,
      circleRadius: 0,
      showPopup: false,
      selectedNews: null,
    };
    this.mapRef = createRef();
  }

  componentDidMount() {
    fetch("https://fastapi-service-34404463322.us-central1.run.app/geojson")
      .then((response) => response.json())
      .then((data) => {
        const jitteredFeatures = this.jitterOverlappingPoints(data.features);
        const jitteredData = {
          type: "FeatureCollection",
          features: jitteredFeatures,
        };
        this.setState({ geoJsonData: jitteredData });
      })
      .catch((error) => console.error("Error loading GeoJSON from API:", error));
  }

  jitterOverlappingPoints = (features) => {
    const jittered = [];
    const seenCoords = new Set();

    features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const key = `${lng.toFixed(5)},${lat.toFixed(5)}`;

      let jitteredLng = lng;
      let jitteredLat = lat;

      if (seenCoords.has(key)) {
        const offsetLng = (Math.random() - 0.5) * 0.02;
        const offsetLat = (Math.random() - 0.5) * 0.02;
        jitteredLng += offsetLng;
        jitteredLat += offsetLat;
      }

      seenCoords.add(key);

      jittered.push({
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: [jitteredLng, jitteredLat],
        },
      });
    });

    return jittered;
  };

  zoomLevels = {
    world: 2,
    country: 4,
    state: 6,
    city: 10,
  };

  handleThemeChange = (theme) => this.setState({ theme });

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

  handleMapClick = (event) => {
    event.originalEvent.stopPropagation();
    const { lng, lat } = event.lngLat;
    if (!this.state.geoJsonData) return;

    const closestNews = this.state.geoJsonData.features.reduce((prev, curr) => {
      const prevDist = Math.hypot(prev.geometry.coordinates[0] - lng, prev.geometry.coordinates[1] - lat);
      const currDist = Math.hypot(curr.geometry.coordinates[0] - lng, curr.geometry.coordinates[1] - lat);
      return currDist < prevDist ? curr : prev;
    });

    this.setState({
      clickedLocation: { longitude: lng, latitude: lat },
      selectedNews: closestNews,
      circleRadius: 5,
      showPopup: false,
    });

    this.animateCircle(() => this.setState({ showPopup: true }));
  };

  animateCircle = (callback) => {
    let radius = 5;
    const interval = setInterval(() => {
      radius += 5;
      this.setState({ circleRadius: radius });
      if (radius > 50) {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 50);
  };

  render() {
    const {
      theme, viewState, zoomLevel,
      clickedLocation, circleRadius,
      selectedNews, showPopup, geoJsonData
    } = this.state;

    const mapStyles = {
      light: "mapbox://styles/mapbox/outdoors-v12",
      dark: "mapbox://styles/mapbox/dark-v11",
    };

    if (!geoJsonData) {
      return <div style={{ color: "#fff", textAlign: "center", marginTop: "2rem" }}>Loading map data...</div>;
    }

    return (
      <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
        <MapFilters
          theme={theme}
          zoomLevel={zoomLevel}
          onThemeChange={this.handleThemeChange}
          onZoomChange={this.handleZoomChange}
        />

        <Map
          ref={this.mapRef}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          initialViewState={viewState}
          style={{ width: "100%", height: "100%" }}
          mapStyle={mapStyles[theme]}
          onClick={this.handleMapClick}
        >
          <Source
            id="heatmap"
            type="geojson"
            data={geoJsonData}
          >
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
    backgroundColor: "#1a1a1a",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "left",
    color: "#ffffff",
  },
  popupTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#ffcc00",
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
  closeButton: {
    position: "absolute",
    top: 5,
    right: 10,
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default HeatMap;
