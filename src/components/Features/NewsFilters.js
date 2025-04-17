import React, { useState } from "react";

const emojiCategories = {
  AI: "🤖",
  Basketball: "🏀",
  Business: "💼",
  Celebrities: "🌟",
  Conflict: "⚔️",
  Crime: "🚔",
  Diplomacy: "🕊️",
  Economy: "💰",
  Elections: "🗳️",
  Energy: "⚡",
  Entertainment: "🎬",
  Environment: "🌿",
  Fashion: "👗",
  Finance: "📊",
  Food: "🍽️",
  Football: "🏈",
  Gaming: "🎮",
  Government: "🏛️",
  Health: "🩺",
  "Higher Education": "🎓",
  Hurricanes: "🌪️",
  Justice: "⚖️",
  Law: "📜",
  Lifestyle: "💅",
  Medicine: "💊",
  "Mental Health": "🧠",
  Military: "🪖",
  Music: "🎵",
  "Natural Disasters": "🌋",
  Olympics: "🥇",
  Parenting: "👨‍👩‍👧",
  Physics: "🔭",
  Police: "👮‍♂️",
  Politics: "🏛️",
  Research: "🔍",
  Science: "🔬",
  Sports: "🏅",
  Startups: "🚀",
  Sustainability: "🌱",
  "TV Shows": "📺",
  Technology: "💻",
  Travel: "✈️",
  Universities: "🏫",
  War: "💣",
  Weather: "🌦️",
  Wildlife: "🦁",
  World: "🌍",
};

const NewsFilters = ({ keyword, selectedCategories, onKeywordChange, onCategoryChange }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchText, setSearchText] = useState("");

  const categoryList = Object.keys(emojiCategories).filter((cat) =>
    cat.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleCheckboxToggle = (cat) => {
    let updated = [...selectedCategories];
    if (updated.includes(cat)) {
      updated = updated.filter((c) => c !== cat);
    } else {
      updated.push(cat);
    }
    onCategoryChange(updated);
  };

  const clearAll = () => onCategoryChange([]);

  return (
    <div style={styles.wrapper}>
      <button onClick={() => setIsExpanded(!isExpanded)} style={styles.toggleButton}>
        {isExpanded ? "🔽 Hide Filters" : "🔼 Show Filters"}
      </button>

      {isExpanded && (
        <div style={styles.container}>
          {/* Keyword Input */}
          <label style={styles.label}>Search Articles</label>
          <input
            type="text"
            placeholder="Enter keyword..."
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            style={styles.input}
          />

          {/* Category Search Input */}
          <label style={{ ...styles.label, marginTop: "16px" }}>Filter by Category</label>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={styles.input}
          />

          {/* Selected Chips */}
          <div style={styles.chipContainer}>
            {selectedCategories.map((cat) => (
              <div key={cat} style={styles.chip}>
                {emojiCategories[cat]} {cat}
                <span style={styles.chipClose} onClick={() => handleCheckboxToggle(cat)}>
                  ×
                </span>
              </div>
            ))}
          </div>

          {/* Checkbox List */}
          <div style={styles.checkboxList}>
            {categoryList.map((cat) => (
              <label key={cat} style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCheckboxToggle(cat)}
                />
                {emojiCategories[cat] || "🗂️"} {cat}
              </label>
            ))}
          </div>

          {/* Clear All Button (Moved Below) */}
          <button onClick={clearAll} style={styles.clearButton}>
            ❌ Clear All
          </button>
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
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.15)",
  },
  container: {
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "10px 12px",
    borderRadius: "8px",
    marginTop: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  chipContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "4px",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: "16px",
    padding: "4px 8px",
    fontSize: "12px",
    color: "#333",
  },
  chipClose: {
    marginLeft: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  checkboxList: {
    maxHeight: "140px",
    overflowY: "auto",
    border: "1px solid #ddd",
    borderRadius: "6px",
    padding: "6px",
    backgroundColor: "#f9f9f9",
  },
  checkboxLabel: {
    display: "block",
    marginBottom: "6px",
    fontSize: "13px",
    color: "#333",
  },
  clearButton: {
    backgroundColor: "#eee",
    color: "#000",
    fontSize: "13px",
    fontWeight: "bold",
    border: "1px solid #bbb",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    width: "100%",
  },
};

export default NewsFilters;
