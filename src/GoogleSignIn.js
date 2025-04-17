// GoogleSignIn.js
import React from "react";
import { auth, provider, signInWithPopup } from "./firebase";

const GoogleSignIn = ({ onSignIn }) => {
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("User signed in:", user);
            if (onSignIn) onSignIn(user); // Send user info back to parent if needed
        } catch (error) {
            console.error("Google Sign-In error:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
                onClick={handleGoogleLogin}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#4285F4",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "16px",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Sign in with Google
            </button>
        </div>
    );
};

export default GoogleSignIn;