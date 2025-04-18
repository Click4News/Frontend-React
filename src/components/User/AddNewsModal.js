// ✅ Add this new component: AddNewsModal.jsx
import React, { useState } from "react";
import styles from "../Map/styles";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";

const AddNewsModal = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");


  const handleSubmit = () => {
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
            coordinates: {
              lat,
              lng,
            },
            geoJson: {
              type: "Location",
              geometry: {
                type: "Point",
                coordinates: [lng, lat], // GeoJSON format = [longitude, latitude]
              },
              properties: {
                name: "Unknown" // you can replace this with a reverse geocode API if needed
              }
            }
          };

          try {
            await fetch("https://sqs-backend-573766487049.us-central1.run.app/user_news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            console.log("Submitted with geoJson:", payload);
            onClose();
          } catch (err) {
            console.error("Submission failed:", err);
            alert("Failed to submit news.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Location permission is required to submit.");
        }
    );
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
