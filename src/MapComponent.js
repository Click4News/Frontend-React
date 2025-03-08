import React, {Component} from "react";
import Map, { Marker, Popup, Source, Layer } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";

// Public Token Taken From
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiaGltYXZhcnNoaXRoNzc3IiwiYSI6ImNtNzZsZHBnZjA5NGoya285MXRybG0ycW0ifQ.zzE8yJ1AcOhd_Qe5CGs0SQ"; // Replace with your actual token

class HeatMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      geoJsonData: null,  // Stores heatmap data
      clickedLocation: null, // Stores clicked coordinates
      circleRadius: 0, // Expanding circle effect
      showPopup: false, // Controls popup visibility
      selectedNews: null, // Stores nearest news for popup
    };
  }

  componentDidMount() {
    // Load GeoJSON news data
    fetch("/usa_heatmap_news_links.geojson")
        .then((response) => response.json())
        .then((data) => this.setState({ geoJsonData: data }))
        .catch((error) => console.error("Error loading GeoJSON:", error));
  }

  handleMapClick = (event) => {
    event.originalEvent.stopPropagation();
    const { lng, lat } = event.lngLat;

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
    const { geoJsonData, clickedLocation, circleRadius, selectedNews, showPopup } = this.state;

    return (
        <Map
            mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            initialViewState={{
              longitude: -98.35, // Center on USA
              latitude: 39.5,
              zoom: 4,
            }}
            style={{ width: "100vw", height: "100vh" }}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            onClick={this.handleMapClick} // Handle map click
        >
          {/* Heatmap Source */}
          {geoJsonData && (
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
          )}

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
                      "circle-color": "rgba(255, 255, 255, 0.5)", // White glow
                      "circle-opacity": ["interpolate", ["linear"], ["zoom"], 0, 0.5, 5, 0],
                      "circle-stroke-width": 2,
                      "circle-stroke-color": "rgba(255, 255, 255, 1)",
                    }}
                />
              </Source>
          )}

          {/* News Popup appears after animation */}
          {selectedNews && showPopup && (
              <Popup
                  longitude={selectedNews.geometry.coordinates[0]}
                  latitude={selectedNews.geometry.coordinates[1]}
                  closeButton={false}  // Disable Mapbox's default close button
                  closeOnClick={false}
                  className="custom-popup" // Apply only custom styles
              >
                <div style={styles.popupContainer}>
                  <button
                      onClick={() => this.setState({selectedNews: null, showPopup: false})}
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