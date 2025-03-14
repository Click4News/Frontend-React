import React from "react";
import HeatMap from "./MapComponent";

function App() {
  return (
    <div style={styles.appContainer}>
      {/* Heading Section with Background Image and Compact Overlay */}
      <div style={styles.heroSection}>
        <div style={styles.overlay}>
          <h1 style={styles.title}>Global News Map</h1>
          <p style={styles.subtitle}>Trending and Popular World Events Visualization</p>
        </div>
      </div>

      {/* Heatmap Component */}
      <div style={styles.mapContainer}>
        <HeatMap />
      </div>
    </div>
  );
}

// Inline CSS for Styling
const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
  },
  heroSection: {
    width: "100%",
    textAlign: "center",
    padding: "8px 6px", // Reduced padding to make it more compact
    backgroundImage: "url('/images/news.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    color: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly reduced opacity
    padding: "10px 15px", // Smaller padding for a more compact look
    borderRadius: "4px",
    display: "inline-block",
  },
  title: {
    fontSize: "20px", // Reduced font size slightly
    fontWeight: "bold",
    color: "#ffffff",
    textShadow: "1px 1px 3px rgba(0,0,0,0.6)", // Adjusted shadow for readability
    margin: "0",
  },
  subtitle: {
    fontSize: "12px", // Slightly smaller subtitle
    fontWeight: "lighter",
    color: "#f0f0f0",
    textShadow: "1px 1px 2px rgba(0,0,0,0.4)",
    marginTop: "3px",
  },
  mapContainer: {
    width: "100%",
    height: "calc(100vh - 80px)", // Reduced height taken up by title bar
  },
};

export default App;
