import React, { useState, useEffect } from "react";
import HeatMap from "./MapComponent";
import GoogleSignIn from "./GoogleSignIn";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  // 🔁 Auto-login listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe(); // cleanup
  }, []);

  const handleSignOut = () => {
    signOut(auth)
        .then(() => setUser(null))
        .catch((error) => console.error("Error signing out:", error));
  };

  return (
      <div style={styles.appContainer}>
        {/* 🧑 Floating User Info */}
        {user && (
            <div style={styles.floatingUserInfo}>
              <img src={user.photoURL} alt="User" style={styles.avatar} />
              <span style={styles.userName}>{user.displayName}</span>
              <button onClick={handleSignOut} style={styles.signOutButton}>
                Sign Out
              </button>
            </div>
        )}

        {/* Hero Section */}
        <div style={styles.heroSection}>
          <div style={styles.overlay}>
            <h1 style={styles.title}>Global News Map</h1>
            <p style={styles.subtitle}>Trending and Popular World Events Visualization</p>
          </div>
        </div>

        {/* Map or Login */}
        <div style={styles.mapContainer}>
          {user ? (
              <HeatMap user={user} />
          ) : (
              <GoogleSignIn onSignIn={setUser} />
          )}
        </div>
      </div>
  );
}

// Inline CSS for Styling
const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    minHeight: "100vh",
    position: "relative",
  },
  heroSection: {
    width: "100%",
    textAlign: "center",
    padding: "40px 10px",
    backgroundImage: "url('/images/news.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    color: "white",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "20px 25px",
    borderRadius: "8px",
    display: "inline-block",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#ffffff",
    textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
    margin: "0",
  },
  subtitle: {
    fontSize: "16px",
    fontWeight: "lighter",
    color: "#f0f0f0",
    textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
    marginTop: "8px",
  },
  mapContainer: {
    width: "100%",
    height: "calc(100vh - 160px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingUserInfo: {
    position: "absolute",
    top: "15px",
    right: "25px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(8px)",
    padding: "6px 14px",
    borderRadius: "20px",
    zIndex: 10,
    color: "#fff",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "1px solid #fff",
  },
  userName: {
    color: "#fff",
    fontSize: "14px",
    fontWeight: "500",
  },
  signOutButton: {
    padding: "5px 10px",
    fontSize: "12px",
    backgroundColor: "#ffffff",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;