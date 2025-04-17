// ✅ Add this new component: AddNewsModal.jsx
import React, { useState } from "react";
import styles from "../Map/styles";

const AddNewsModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = () => {
    const payload = {
      title,
      summary,
      link,
      category,
    };
    // TODO: replace this with your API call
    console.log("Submitting new article:", payload);
    onClose();
  };

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <h3 style={{ margin: 0 }}>📝 Submit News Article</h3>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          style={{ ...styles.input, resize: "none" }}
        />
        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <button onClick={onClose} style={styles.clearButton}>
            Cancel
          </button>
          <button onClick={handleSubmit} style={styles.readMoreButton}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewsModal;
