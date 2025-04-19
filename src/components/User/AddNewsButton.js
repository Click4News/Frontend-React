import React, { useState } from "react";
import AddNewsModal from "./AddNewsModal";

const AddNewsButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        style={styles.fab}
        onClick={() => setShowModal(true)}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        📝 Add News
      </button>

      {showModal && <AddNewsModal onClose={() => setShowModal(false)} />}
    </>
  );
};

const styles = {
  fab: {
    position: "fixed",
    bottom: "80px",
    right: "10px",
    width: "260px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px 0",
    fontSize: "15px",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    zIndex: 1000,
    transition: "all 0.2s ease",
  },
};

export default AddNewsButton;
