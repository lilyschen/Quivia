import React from 'react';

const SavedFlashcards = ({
  savedFlashcards,
  handleSavedCardClick,
  handleDeleteFlashcard,
  handleEditFlashcard,
  handleAddFlashcardToStudySet,
  selectedStudySet,
  setSelectedFlashcardId,
}) => {
  return (
    <div className="saved-flashcards">
      <h2>Saved Flashcards</h2>
      <div className="flashcard-container">
        {savedFlashcards.map((flashcard, index) => (
          <div
            key={index}
            className="flashcard"
            onClick={() => handleSavedCardClick(index)}
          >
            <p>
              {flashcard.showAnswer ? (
                <>
                  <strong>Answer:</strong> {flashcard.answer}
                </>
              ) : (
                <>
                  <strong>Question:</strong> {flashcard.question}
                </>
              )}
            </p>
            <button onClick={() => handleDeleteFlashcard(flashcard._id)}>
              Delete Flashcard
            </button>
            <button onClick={() => handleEditFlashcard(flashcard)}>
              Edit Flashcard
            </button>
            <button
              onClick={() => {
                setSelectedFlashcardId(flashcard._id);
                handleAddFlashcardToStudySet(flashcard._id, selectedStudySet);
              }}
              disabled={!selectedStudySet}
            >
              Add to Study Set
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedFlashcards;
