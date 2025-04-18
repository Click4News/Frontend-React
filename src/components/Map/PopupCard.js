import React, { useState, useEffect } from "react";
import styles from "./styles";

const PopupCard = ({ selectedNews, multipleNews, onClose, onNext }) => {
    const [userVote, setUserVote] = useState(null); // "like" | "fake" | null
    const [likes, setLikes] = useState(0);
    const [fakeFlags, setFakeFlags] = useState(0);

    // 🔄 Reset vote state when selected article changes
    useEffect(() => {
        setUserVote(null);
        setLikes(selectedNews.properties.likes || 0);
        setFakeFlags(selectedNews.properties.fakeflags || 0);
    }, [selectedNews]);

    const handleLike = () => {
        if (userVote === "like") {
            setLikes((prev) => prev - 1);
            setUserVote(null);
        } else {
            if (userVote === "fake") setFakeFlags((prev) => prev - 1);
            setLikes((prev) => prev + 1);
            setUserVote("like");
        }
    };

    const handleFakeFlag = () => {
        if (userVote === "fake") {
            setFakeFlags((prev) => prev - 1);
            setUserVote(null);
        } else {
            if (userVote === "like") setLikes((prev) => prev - 1);
            setFakeFlags((prev) => prev + 1);
            setUserVote("fake");
        }
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