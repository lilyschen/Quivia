import React, { useState } from "react";
import TextArea from "../components/TextArea";

const UploadNotes = ({ notes, setNotes, setFlashcards }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleGenerateFlashcards = async () => {
    const formData = new FormData();
    formData.append("notes", notes);
    if (file) {
      formData.append("pdf", file);
    }

    try {
      const response = await fetch(
        "http://localhost:3000/generate-flashcards",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setFlashcards((prevFlashcards) => [
        ...prevFlashcards,
        ...data.flashcards,
      ]);
      setFile(null);
      setNotes("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(`Error generating flashcards: ${error.message}`);
    }
  };

  return (
    <div className="input-box">
      <p className="subtitle">
        Upload your course notes or paste them below to add more flashcards to
        this study set!
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
      <button className="btn" onClick={handleGenerateFlashcards}>
        Generate Flashcards
      </button>
    </div>
  );
};

export default UploadNotes;
