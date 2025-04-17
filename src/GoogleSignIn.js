import React from "react";
import { auth, provider, signInWithPopup } from "./firebase";

const GoogleSignIn = ({ onSignIn }) => {
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (onSignIn) onSignIn(user);
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.glassCard}>
                <h1 style={styles.heading}>🌍 Click4News</h1>
                <p style={styles.tagline}>See the world’s pulse — visualized on a map.</p>
                <p style={styles.description}>
                    Discover trending events, breaking stories, and global insights updated in real-time. Zoom into countries and cities to explore what's buzzing near and far.
                </p>
                <button style={styles.signInButton} onClick={handleGoogleLogin}>
                     Sign in with Google
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(135deg, #1f1c2c, #928dab)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
    },
    glassCard: {
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        padding: "40px 30px",
        maxWidth: "480px",
        textAlign: "center",
        boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        color: "#fff",
    },
    heading: {
        fontSize: "32px",
        fontWeight: "800",
        marginBottom: "10px",
    },
    tagline: {
        fontSize: "18px",
        fontWeight: "500",
        marginBottom: "18px",
        color: "#f1f1f1",
    },
    description: {
        fontSize: "15px",
        lineHeight: "1.6",
        color: "#ddd",
        marginBottom: "30px",
    },
    signInButton: {
        padding: "12px 20px",
        background: "linear-gradient(to right, #ff416c, #ff4b2b)",
        border: "none",
        borderRadius: "30px",
        fontSize: "16px",
        fontWeight: "bold",
        color: "#fff",
        cursor: "pointer",
        boxShadow: "0 4px 12px rgba(255, 75, 43, 0.4)",
        transition: "transform 0.2s ease",
    },
};

export default GoogleSignIn;