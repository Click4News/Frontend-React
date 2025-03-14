import React from "react";

const MapFilters = ({ theme, zoomLevel, onThemeChange, onZoomChange }) => {
  return (
    <div style={styles.filterContainer}>
      <label style={styles.label}>Zoom Level:</label>
      <select onChange={(e) => onZoomChange(e.target.value)} value={zoomLevel} style={styles.dropdown}>
        <option value="world">World 🌍</option>
        <option value="country">Country 🏳️</option>
        <option value="state">State 🏔️</option>
        <option value="city">City📍</option>
      </select>

      <label style={styles.label}>Theme:</label>
      <select onChange={(e) => onThemeChange(e.target.value)} value={theme} style={styles.dropdown}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
};

// Styles for the UI Components
const styles = {
  filterContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 2,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "8px 12px",
    borderRadius: "6px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
  },
  dropdown: {
    backgroundColor: "white",
    color: "#333",
    padding: "4px 8px",
    fontSize: "13px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    cursor: "pointer",
    outline: "none",
    transition: "all 0.2s ease-in-out",
  },
};

export default MapFilters;
