import React, { useState, useEffect } from "react";
import HeatMap from "./components/Map/HeatMap";
import EmailAuth from "./EmailAuth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => setUser(null))
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <div style={styles.appContainer}>
      {/* Floating User Info */}
      {user && (
        <div style={styles.floatingUserInfo}>
          <img
            src={user.photoURL || "/default-avatar.png"}
            alt="User"
            style={styles.avatar}
          />
          <div style={styles.userDetails}>
            <span style={styles.userName}>
              {user.displayName || user.email}
            </span>
            <button onClick={handleSignOut} style={styles.signOutButton}>
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div style={styles.heroSection}>
        <div style={styles.overlay}>
          <h1 style={styles.title}>Global News Map</h1>
          <p style={styles.subtitle}>
            Trending and Popular World Events Visualization
          </p>
        </div>
      </div>

      {/* Map or Auth */}
      <div style={styles.mapContainer}>
        {user ? <HeatMap user={user} /> : <EmailAuth onSignIn={setUser} />}
      </div>
    </div>
  );
}

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  floatingUserInfo: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    zIndex: 10,
    maxWidth: "80%",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  userName: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
    lineHeight: "1.2",
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  signOutButton: {
    marginTop: "4px",
    padding: "4px 8px",
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    cursor: "pointer",
  },
  heroSection: {
    flex: "0 0 auto",
    width: "100%",
    textAlign: "center",
    padding: "8px 6px",
    backgroundImage: "url('/images/news.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: "12px 18px",
    borderRadius: "6px",
    display: "inline-block",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#ffffff",
    margin: "0",
    textShadow: "1px 1px 3px rgba(0,0,0,0.6)",
  },
  subtitle: {
    fontSize: "13px",
    fontWeight: "lighter",
    color: "#f0f0f0",
    marginTop: "6px",
    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
  },
  mapContainer: {
    flex: "1 1 auto",
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
  },
};

export default App;
