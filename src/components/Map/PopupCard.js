import React, { useState, useEffect } from "react";
import styles from "../../styles";
import { getAuth } from "firebase/auth";

const PopupCard = ({ selectedNews, multipleNews, onClose, onNext }) => {
  const [userVote, setUserVote] = useState(null); // "like" | "fake" | null
  const [likes, setLikes] = useState(0);
  const [fakeFlags, setFakeFlags] = useState(0);
  const [trust, setTrust] = useState({
    label: "Community Voice",
    color: "#fbc02d",
    emoji: "🗣",
  });

  // Function to send vote to the backend
  const sendVoteToBackend = async (type) => {
    const user = getAuth().currentUser;
    if (!user) return;

    const payload = {
      type,
      message_id: selectedNews.properties.message_id,
      userid: user.uid,
    };

    try {
      await fetch("https://sqs-backend-573766487049.us-central1.run.app/user_news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      console.log("Vote sent:", payload);
    } catch (error) {
      console.error("Failed to send vote:", error);
    }
  };

  // Function to determine trust tier based on category and random values for other categories
  const determineTrustTier = (category = "") => {
    if (category === "User-Generated") {
      // If category is User-Generated, set trust to "Community Voice"
      return { label: "Community Voice", color: "#fbc02d", emoji: "🗣" };
    }

    // Generate a random credibility score between 61 and 100
    const randomCred = Math.random() * (100 - 61) + 61;

    // Set trust level based on the random credibility score
    if (randomCred >= 81)
      return { label: "Verified Source", color: "#2e7d32", emoji: "🛡" };
    return { label: "Trusted Contributor", color: "#43a047", emoji: "✅" };
  };

  // Fetch credibility and update trust tier on component mount
  useEffect(() => {
    setUserVote(null);
    setLikes(selectedNews.properties.likes || 0);
    setFakeFlags(selectedNews.properties.fakeflags || 0);

    const category = selectedNews.properties.category;

    // Set trust tier based on category
    const tier = determineTrustTier(category);
    setTrust(tier);
  }, [selectedNews]);

  // Handle user likes
  const handleLike = async () => {
    if (userVote === "like") {
      setLikes((prev) => prev - 1);
      setUserVote(null);
    } else {
      if (userVote === "fake") setFakeFlags((prev) => prev - 1);
      setLikes((prev) => prev + 1);
      setUserVote("like");
    }
    await sendVoteToBackend("LIKED");
  };

  // Handle fake flag votes
  const handleFakeFlag = async () => {
    if (userVote === "fake") {
      setFakeFlags((prev) => prev - 1);
      setUserVote(null);
    } else {
      if (userVote === "like") setLikes((prev) => prev - 1);
      setFakeFlags((prev) => prev + 1);
      setUserVote("fake");
    }
    await sendVoteToBackend("FAKEFLAGGED");
  };

  // Convert timestamp to a readable date format
  const publishedDate = new Date(
    selectedNews.properties.timestamp * 1000
  ).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Set source value based on category
  const source =
    selectedNews.properties.category === "User-Generated"
      ? "User-Generated"
      : selectedNews.properties.userid || "Unknown";

  // Highlight if the source is User-Generated
  const sourceStyle =
    selectedNews.properties.category === "User-Generated"
      ? { backgroundColor: "#ffc107", color: "#000", fontWeight: "bold" }
      : {};

  return (
    <div style={styles.popupContainer}>
      <button onClick={onClose} style={styles.closeButton}>
        ✕
      </button>

      <h3 style={styles.popupTitle}>{selectedNews.properties.title}</h3>
      <p style={styles.popupSummary}>{selectedNews.properties.summary}</p>

      {/* Source, Published Date, and Trust Level */}
      <div style={{ marginBottom: "8px", fontSize: "14px", color: "#666" }}>
        <p>
          <strong>Source:</strong>{" "}
          <span style={sourceStyle}>{source}</span>
        </p>
        <p>
          <strong>Published:</strong> {publishedDate}
        </p>
        <div
          style={{
            marginTop: "6px",
            display: "inline-block",
            padding: "4px 10px",
            backgroundColor: trust.color,
            color: "#fff",
            borderRadius: "20px",
            fontSize: "13px",
            fontWeight: "bold",
          }}
        >
          {trust.emoji} {trust.label}
        </div>
      </div>

      <button
        style={styles.readMoreButton}
        onClick={() => window.open(selectedNews.properties.link, "_blank")}
      >
        Read More
      </button>

      <div style={styles.voteRow}>
        <button
          onClick={handleLike}
          style={{
            ...styles.voteButton,
            backgroundColor: userVote === "like" ? "#28a745" : "#6c757d",
            color: "#fff",
          }}
        >
          <span style={{ fontSize: "18px", marginRight: "4px" }}>👍</span> Likes {likes}
        </button>

        <button
          onClick={handleFakeFlag}
          style={{
            ...styles.voteButton,
            backgroundColor: userVote === "fake" ? "#dc3545" : "#6c757d",
            color: "#fff",
          }}
        >
          <span style={{ fontSize: "18px", marginRight: "4px" }}>🚩</span> Fake Flags {fakeFlags}
        </button>
      </div>

      {multipleNews && (
        <button
          style={{
            ...styles.readMoreButton,
            backgroundColor: "#333",
            color: "#fff",
            marginTop: "8px",
          }}
          onClick={onNext}
        >
          ▶ Next News
        </button>
      )}
    </div>
  );
};

export default PopupCard;
