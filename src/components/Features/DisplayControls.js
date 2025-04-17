import React, { useState } from "react";

const DisplayControls = ({
  theme,
  viewLevel,
  zoom,
  onThemeChange,
  onViewLevelChange,
  onZoomChange,
  onResetView,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div style={styles.wrapper}>
      <button onClick={() => setIsExpanded(!isExpanded)} style={styles.toggleButton}>
        {isExpanded ? "🔽 Hide Controls" : "🔼 Show Controls"}
      </button>

      {isExpanded && (
        <div style={styles.container}>
          {/* Theme */}
          <div style={styles.section}>
            <label style={styles.label}>Theme</label>
            <div style={styles.toggleRow}>
              <button
                style={{
                  ...styles.themeButton,
                  backgroundColor: theme === "light" ? "#ffd700" : "#eee",
                }}
                onClick={() => onThemeChange("light")}
              >
                🌞 Light
              </button>
              <button
                style={{
                  ...styles.themeButton,
                  backgroundColor: theme === "dark" ? "#333" : "#eee",
                  color: theme === "dark" ? "#fff" : "#000",
                }}
                onClick={() => onThemeChange("dark")}
              >
                🌙 Dark
              </button>
            </div>
          </div>

          <hr style={styles.divider} />

          {/* View Level */}
          <div style={styles.section}>
            <label style={styles.label}>View Level</label>
            <div style={styles.radioGroup}>
              {Object.entries(viewIcons).map(([level, icon]) => (
                <label key={level} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="viewLevel"
                    value={level}
                    checked={viewLevel === level}
                    onChange={() => onViewLevelChange(level)}
                  />
                  {icon} {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <hr style={styles.divider} />

          {/* Zoom */}
          <div style={styles.section}>
            <label style={styles.label}>Zoom: {zoom.toFixed(1)}x</label>
            <div style={styles.zoomControls}>
              <button
                onClick={() => onZoomChange(parseFloat((zoom - 1).toFixed(1)), "button")}
                style={styles.zoomButton}
              >
                ➖
              </button>
              <input
                type="range"
                min="1"
                max="16"
                step="0.1"
                value={zoom}
                onChange={(e) => onZoomChange(parseFloat(e.target.value), "button")}
                style={styles.slider}
              />
              <button
                onClick={() => onZoomChange(parseFloat((zoom + 1).toFixed(1)), "button")}
                style={styles.zoomButton}
              >
                ➕
              </button>
            </div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.section}>
            <button onClick={onResetView} style={styles.resetButton}>
              ⟳ Reset View
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const viewIcons = {
  world: "🌍",
  country: "🏳️",
  state: "🏔️",
  city: "📍",
};

const styles = {
  wrapper: {
    width: "100%", // ✅ Fill parent width (260px from HeatMap)
    position: "relative", // ✅ No absolute positioning
  },
  toggleButton: {
    width: "100%",
    padding: "8px 12px",
    background: "#5c6bc0",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  container: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "10px 12px",
    borderRadius: "8px",
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
  },
  toggleRow: {
    display: "flex",
    gap: "8px",
  },
  themeButton: {
    flex: 1,
    padding: "6px",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    border: "1px solid #ccc",
  },
  radioGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    paddingLeft: "4px",
  },
  radioLabel: {
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  zoomControls: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  zoomButton: {
    padding: "4px 8px",
    fontSize: "14px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
  },
  slider: {
    flex: 1,
    width: "100%", // ✅ responsive slider
  },
  resetButton: {
    padding: "6px 10px",
    backgroundColor: "#eee",
    color: "#000",
    border: "1px solid #bbb",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },
  divider: {
    height: "1px",
    border: "none",
    backgroundColor: "#ccc",
    margin: "6px 0",
  },
};

export default DisplayControls;
