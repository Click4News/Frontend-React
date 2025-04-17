// Floating Button + News Form Modal
import React, { useState } from "react";

const AddNewsButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    category: "",
    link: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting News:", formData);
    setShowModal(false);
    setFormData({ title: "", summary: "", category: "", link: "" });
  };

  return (
    <>
      <button
        style={styles.fab}
        onClick={() => setShowModal(true)}
      >
        ➕ Add News
      </button>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Add News Article</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <textarea
                name="summary"
                placeholder="Summary"
                value={formData.summary}
                onChange={handleInputChange}
                style={styles.textarea}
                required
              />
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <input
                type="url"
                name="link"
                placeholder="Link to Article"
                value={formData.link}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
              <div style={styles.buttonRow}>
                <button type="submit" style={styles.submitButton}>Submit</button>
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  fab: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    padding: "12px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    zIndex: 1000
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1001
  },
  modal: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "10px",
    width: "400px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
    color: "#333"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  input: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },
  textarea: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minHeight: "80px"
  },
  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
  },
  submitButton: {
    backgroundColor: "#4caf50",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    padding: "8px 14px",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default AddNewsButton;
