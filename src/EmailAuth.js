import React, { useState } from "react";
import { auth, provider } from "./firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const EmailAuth = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // 'login' or 'register'
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const method =
        mode === "register"
          ? createUserWithEmailAndPassword
          : signInWithEmailAndPassword;
      const result = await method(auth, email, password);
      onSignIn(result.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return setError("Enter your email to reset password.");
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onSignIn(result.user);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>{mode === "login" ? "Sign in" : "Join Click4News"}</h2>
        <p style={styles.subtitle}>
          {mode === "login"
            ? "Stay updated on real-time global stories."
            : "Create your account to explore breaking news by location."}
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <div style={styles.passwordField}>
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ ...styles.input, marginBottom: 0 }}
          />
          <span onClick={() => setShowPwd(!showPwd)} style={styles.showBtn}>
            {showPwd ? "hide" : "show"}
          </span>
        </div>

        {mode === "register" && (
          <div style={styles.passwordField}>
            <input
              type={showConfirmPwd ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ ...styles.input, marginBottom: 0 }}
            />
            <span onClick={() => setShowConfirmPwd(!showConfirmPwd)} style={styles.showBtn}>
              {showConfirmPwd ? "hide" : "show"}
            </span>
          </div>
        )}

        <div style={styles.links}>
          {mode === "login" && (
            <span onClick={handleResetPassword} style={styles.link}>
              Forgot password?
            </span>
          )}
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.submitBtn}>
          {mode === "login" ? "Sign in" : "Join now"}
        </button>

        <div style={styles.orDivider}>
          <span style={styles.line}></span>
          <span style={styles.or}>or</span>
          <span style={styles.line}></span>
        </div>

        <button type="button" style={styles.googleBtn} onClick={handleGoogleLogin}>
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="Google"
            style={styles.googleIcon}
          />
          Sign in with Google
        </button>

        <p style={styles.footer}>
          {mode === "login" ? "New to Click4News?" : "Already a user?"}{" "}
          <span onClick={() => setMode(mode === "login" ? "register" : "login")} style={styles.link}>
            {mode === "login" ? "Join now" : "Sign in"}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "24px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  passwordField: {
    position: "relative",
    marginBottom: "16px",
  },
  showBtn: {
    position: "absolute",
    right: "12px",
    top: "12px",
    fontSize: "13px",
    color: "#0a66c2",
    cursor: "pointer",
  },
  links: {
    textAlign: "right",
    marginBottom: "12px",
  },
  link: {
    color: "#0a66c2",
    fontSize: "13px",
    cursor: "pointer",
    textDecoration: "none",
  },
  submitBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0a66c2",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "16px",
  },
  orDivider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0",
  },
  line: {
    flex: 1,
    height: "1px",
    backgroundColor: "#ccc",
  },
  or: {
    margin: "0 10px",
    color: "#666",
    fontSize: "12px",
  },
  googleBtn: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    borderRadius: "24px",
    border: "1px solid #000",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  googleIcon: {
    width: "18px",
    height: "18px",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
};

export default EmailAuth;
