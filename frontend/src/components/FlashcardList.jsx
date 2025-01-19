import React from "react";

const FlashcardList = ({
  flashcards,
  handleCardClick,
  editMode,
  handleDeleteFlashcard,
  handleSaveFlashcard,
}) => {
  return (
    <div className="flashcard-container">
      <h2>Flashcards</h2>
      {flashcards.map((flashcard, index) => (
        <div
          key={index}
          className="flashcard"
          onClick={() => handleCardClick(index)}
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
          {/* Conditionally render the delete button in edit mode */}
          {editMode && (
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering handleCardClick
                handleDeleteFlashcard(flashcard._id); // Call the delete handler
              }}
            >
              <img className="delete-img" src="/bin.png" />
            </button>
          )}
          {/* <button
            className="save-btn"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering handleCardClick
              handleSaveFlashcard(flashcard);
            }}
          >
            Save Flashcard
          </button> */}
        </div>
      ))}
    </div>
  );
};

export default FlashcardList;
