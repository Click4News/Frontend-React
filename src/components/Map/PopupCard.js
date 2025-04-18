import React, { useState, useEffect } from "react";
import styles from "./styles";
import { getAuth } from "firebase/auth";
const PopupCard = ({ selectedNews, multipleNews, onClose, onNext }) => {
    const [userVote, setUserVote] = useState(null); // "like" | "fake" | null
    const [likes, setLikes] = useState(0);
    const [fakeFlags, setFakeFlags] = useState(0);
    const sendVoteToBackend = async (type) => {
        const user = getAuth().currentUser;
        if (!user) return;

        const messageId = selectedNews.properties.message_id;
        const payload = {
            type,
            message_id: messageId,
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
    // 🔄 Reset vote state when selected article changes
    useEffect(() => {
        setUserVote(null);
        setLikes(selectedNews.properties.likes || 0);
        setFakeFlags(selectedNews.properties.fakeflags || 0);
    }, [selectedNews]);

    const handleLike = async() => {
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

    const handleFakeFlag = async() => {
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

    return (
        <div style={styles.popupContainer}>
            <button onClick={onClose} style={styles.closeButton}>
                ✕
            </button>

            <h3 style={styles.popupTitle}>{selectedNews.properties.title}</h3>
            <p style={styles.popupSummary}>{selectedNews.properties.summary}</p>

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