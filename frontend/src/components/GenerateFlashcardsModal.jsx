import React, { useState } from "react";
import TextArea from "./TextArea";

const GenerateFlashcardsModal = ({ onClose, userInfo, onFlashcardsGenerated }) => {
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state to manage async operations

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleGenerateFlashcards = async () => {
    if (!notes && !file) {
      alert("Please provide either notes or a file to generate flashcards.");
      return;
    }

    const formData = new FormData();
    formData.append("notes", notes);
    if (file) {
      formData.append("pdf", file);
    }

    setIsLoading(true); // Start loading state

    try {
      const response = await fetch("http://localhost:3000/generate-flashcards", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();

      if (!data.flashcards || data.flashcards.length === 0) {
        throw new Error("No flashcards were generated.");
      }

      // Add flashcards to parent component
      onFlashcardsGenerated(data.flashcards);
      
      // Clear states after success
      setFile(null);
      setNotes("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(`Error generating flashcards: ${error.message}`);
    } finally {
      setIsLoading(false);  // Ensure loading state is cleared
      onClose();  // Close modal after operations are done
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Generate Flashcards</h2>
        <div className="input-box">
          <p className="subtitle">
            Upload your course notes or paste them below to create a personalized study guide!
          </p>
          <TextArea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Paste your notes here..."
            className="textarea-no-shadow"
          />
          <p className="subtitle"> OR </p>
          <input
            type="file"
            className="file-input"
            accept="application/pdf"
            onChange={handleFileChange}
          />
          <button
            className="btn"
            onClick={handleGenerateFlashcards}
            disabled={!userInfo || isLoading} // Disable button while loading
          >
            {isLoading ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateFlashcardsModal;
