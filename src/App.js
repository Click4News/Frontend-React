import React, { useState, useEffect } from "react";
import HeatMap from "./components/Map/HeatMap";
import EmailAuth from "./EmailAuth";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState({
    articles: 0,
    likes: 0,
    dislikes: 0,
    credibility: 50,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("✅ Logged in as:", firebaseUser.uid);
        setUser(firebaseUser);

        const payload = { userid: firebaseUser.uid };
        console.log("📦 Sending user stats request for:", payload);

        fetch("https://fastapi-service-34404463322.us-central1.run.app/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => {
              const formatted = {
                articles: data.total_articles || 0,
                likes: data.total_likes_received || 0,
                dislikes: data.total_fakeflags_received || 0,
                credibility: data.credibility_score || 50,
              };
              console.log("✅ Final formatted userStats:", formatted);
              setUserStats(formatted);
            })
          .catch((err) => {
            console.error("❌ Failed to fetch user stats:", err);
            setUserStats({
              articles: 0,
              likes: 0,
              dislikes: 0,
              credibility: 50,
            });
          });
      } else {
        console.log("🔒 User signed out or not authenticated.");
        setUser(null);
        setUserStats({
          articles: 0,
          likes: 0,
          dislikes: 0,
          credibility: 50,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("👋 Signed out");
        setUser(null);
        setUserStats({
          articles: 0,
          likes: 0,
          dislikes: 0,
          credibility: 50,
        });
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <div style={styles.appContainer}>
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

      <div style={styles.heroSection}>
        <div style={styles.overlay}>
          <h1 style={styles.title}>Click4News</h1>
          <p style={styles.subtitle}>
            Trending and Popular World Events Visualization
          </p>
        </div>
      </div>

      <div style={styles.mapContainer}>
        {user ? (
          <HeatMap user={user} userid={user.uid} userStats={userStats} />
        ) : (
          <EmailAuth onSignIn={setUser} />
        )}
      </div>
    </div>
  );
}

// ✅ Styles stay unchanged
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
    overflow: "visible",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default App;