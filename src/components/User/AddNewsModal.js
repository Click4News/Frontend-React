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
          const formattedTime = time.split(".")[0]; // remove milliseconds

          const payload = {
            uri: uuidv4(), // generate unique ID
            lang: "eng",
            isDuplicate: false,
            date,
            time: formattedTime,
            dateTime: isoString,
            dateTimePub: isoString, // or set to another publish time if needed
            dataType: "news",
            sim: 0,
            url: link,
            title,
            body: summary,
            userid: getAuth().currentUser?.uid|| "anonymous",
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          };

          try {
            await fetch("https://sqs-backend-573766487049.us-central1.run.app/user_news", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            console.log("News submitted:", payload);
            onClose();
          } catch (err) {
            console.error("Error submitting:", err);
            alert("Error submitting the news.");
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
