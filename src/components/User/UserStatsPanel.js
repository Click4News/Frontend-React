import React, { useState } from "react";

const UserStatsPanel = ({ userStats = {} }) => {
  const {
    articles = 0,
    likes = 0,
    dislikes = 0,
    credibility = 50,
  } = userStats;

  const [isExpanded, setIsExpanded] = useState(true);

  const trustTier = (cred) => {
    if (cred >= 91) return { label: "Verified Source", icon: "🛡", color: "#2e7d32" };
    if (cred >= 61) return { label: "Trusted Contributor", icon: "✅", color: "#43a047" };
    if (cred >= 41) return { label: "Community Voice", icon: "🗣", color: "#fbc02d" };
    if (cred >= 21) return { label: "Unreliable Source", icon: "❗", color: "#fb8c00" };
    return { label: "Flagged Account", icon: "🚩", color: "#e53935" };
  };

  const tierData = [
    { min: 0, max: 20, emoji: "🚩", range: "0–20", label: "Flagged Account" },
    { min: 21, max: 40, emoji: "❗", range: "21–40", label: "Unreliable Source" },
    { min: 41, max: 60, emoji: "🗣", range: "41–60", label: "Community Voice" },
    { min: 61, max: 90, emoji: "✅", range: "61–90", label: "Trusted Contributor" },
    { min: 91, max: 120, emoji: "🛡", range: "91–120", label: "Verified Source" }
  ];

  const { label: tierLabel, icon, color } = trustTier(credibility);

  return (
    <div style={styles.wrapper}>
      <button onClick={() => setIsExpanded(!isExpanded)} style={styles.toggleButton}>
        {isExpanded ? "🔽 User Stats" : "🔼 User Stats"}
      </button>

      {isExpanded && (
        <div style={styles.container}>
          <div style={styles.section}>
            <label style={styles.label}>Trust Level</label>
            <div style={{ ...styles.tierDisplay, color }}>{icon} {tierLabel}</div>
          </div>

          <hr style={styles.divider} />

          <div style={styles.section}>
            <label style={styles.label}>Trust Score</label>
            <div style={styles.trustBarWrapper}>
              <div style={styles.trustBar}>
                <div
                  style={{
                    ...styles.trustPointer,
                    left: `calc(${Math.min(credibility / 120 * 100, 100)}% - 10px)`
                  }}
                >
                  🔵
                </div>
              </div>
              <div style={styles.credibilityText}>{credibility} points</div>
            </div>
          </div>

          <div style={styles.sectionTable}>
            <div style={styles.tableRow}><span style={styles.tableLabel}>📝 Articles Submitted:</span><span style={styles.tableValue}>{articles}</span></div>
            <div style={styles.tableRow}><span style={styles.tableLabel}>👍 Total Likes:</span><span style={{ ...styles.tableValue, color: "#4caf50" }}>{likes}</span></div>
            <div style={styles.tableRow}><span style={styles.tableLabel}>👎 Total Fake Flags:</span><span style={{ ...styles.tableValue, color: "#f44336" }}>{dislikes}</span></div>
          </div>

          <div style={styles.tierTable}>
            {tierData.map((row, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.tierRow,
                  fontWeight: credibility >= row.min && credibility <= row.max ? "bold" : "normal",
                  backgroundColor: credibility >= row.min && credibility <= row.max ? "#eef4ff" : "transparent",
                  border: "1px solid #eee",
                }}
              >
                <span style={styles.legendCol}>{row.emoji}</span>
                <span style={styles.legendCol}>{row.range}</span>
                <span style={styles.legendCol}>{row.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    width: "100%",
    position: "relative",
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
  sectionTable: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },
  tableLabel: {
    fontWeight: "500",
    color: "#555",
  },
  tableValue: {
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#222",
  },
  tierDisplay: {
    fontSize: "15px",
    fontWeight: "bold",
  },
  trustBarWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  trustBar: {
    width: "100%",
    height: "14px",
    background: "linear-gradient(to right, #e53935, #fb8c00, #fdd835, #8bc34a, #43a047)",
    borderRadius: "8px",
    position: "relative",
    marginBottom: "6px",
  },
  trustPointer: {
    position: "absolute",
    top: "-8px",
    fontSize: "18px",
    transition: "left 0.3s ease",
  },
  credibilityText: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
  },
  divider: {
    height: "1px",
    border: "none",
    backgroundColor: "#ccc",
    margin: "6px 0",
  },
  tierTable: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "13px",
    borderTop: "1px solid #ccc",
    paddingTop: "10px",
  },
  tierRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "6px",
    fontSize: "13px",
  },
  legendCol: {
    width: "33.33%",
    textAlign: "center",
  },
};

export default UserStatsPanel;