import React from 'react';

const EditFlashcard = ({
  editFlashcard,
  setEditFlashcard,
  handleSaveEditFlashcard,
  setEditMode,
}) => {
  return (
    <div className="edit-box">
      <h3>Edit Flashcard</h3>
      <textarea
        rows="2"
        cols="50"
        value={editFlashcard.question}
        onChange={(e) =>
          setEditFlashcard({ ...editFlashcard, question: e.target.value })
        }
        placeholder="Edit question here..."
      ></textarea>
      <textarea
        rows="2"
        cols="50"
        value={editFlashcard.answer}
        onChange={(e) =>
          setEditFlashcard({ ...editFlashcard, answer: e.target.value })
        }
        placeholder="Edit answer here..."
      ></textarea>
      <button className="btn" onClick={handleSaveEditFlashcard}>
        Save Changes
      </button>
      <button className="btn" onClick={() => setEditMode(false)}>
        Cancel
      </button>
    </div>
  );
};

export default EditFlashcard;
