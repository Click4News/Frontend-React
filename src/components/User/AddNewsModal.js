import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const AddNewsModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !summary.trim()) {
      alert("Title and Summary are required.");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const now = new Date();
        const isoString = now.toISOString();
        const [date, time] = isoString.split("T");
        const formattedTime = time.split(".")[0];
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const payload = {
          uri: uuidv4(),
          lang: "eng",
          isDuplicate: false,
          date,
          time: formattedTime,
          dateTime: isoString,
          dateTimePub: isoString,
          dataType: "news",
          sim: 0,
          url: link,
          title,
          body: summary,
          userid: getAuth().currentUser?.uid || "anonymous",
          coordinates: { lat, lng },
          geoJson: {
            type: "Location",
            geometry: { type: "Point", coordinates: [lng, lat] },
            properties: { name: "Unknown" },
          },
          category: "User-Generated",
        };

        try {
          await fetch("https://sqs-backend-573766487049.us-central1.run.app/user_news", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          setTimeout(() => {
            onClose();
          }, 50);

          setTimeout(() => {
            alert("✅ News Submitted!");
          }, 150);
        } catch (err) {
          alert("Failed to submit news.");
          console.error(err);
        }
      },
      (error) => {
        alert("Location permission is required to submit.");
        console.error(error);
      }
    );
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <h2 style={styles.header}>📝 Submit News</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline for the article"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Summary *</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Write a short summary..."
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Link (optional)</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            style={styles.input}
          />
        </div>

        {/* <div style={styles.formGroup}>
          <label style={styles.label}>Category</label>
          <input
            type="text"
            value="User-Generated"
            readOnly
            style={{
              ...styles.input,
              backgroundColor: "#2b2b2b",
              color: "#bbb",
              cursor: "not-allowed",
            }}
          />
        </div> */}

        <div style={styles.buttonRow}>
          <button onClick={onClose} style={styles.cancel}>
            ❌ Cancel
          </button>
          <button onClick={handleSubmit} style={styles.submit}>
            🚀 Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    backdropFilter: "blur(3px)",
  },
  modal: {
    backgroundColor: "#1f1f1f",
    color: "#eee",
    padding: "24px 26px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "bold",
    color: "#ffcc00",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "bold",
    color: "#ccc",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  textarea: {
    minHeight: "80px",
    resize: "vertical",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #444",
    backgroundColor: "#2c2c2c",
    color: "#fff",
    fontSize: "14px",
    outline: "none",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginTop: "10px",
  },
  submit: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  cancel: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f44336",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.2s",
  },
};

export default AddNewsModal;