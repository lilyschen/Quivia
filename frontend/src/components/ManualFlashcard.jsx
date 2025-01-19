import React, { useState } from "react";

const ManualFlashcard = ({ userInfo, onSave }) => {
  const [manualQuestion, setManualQuestion] = useState('');
  const [manualAnswer, setManualAnswer] = useState('');

  const handleManualFlashcardCreation = () => {
    if (!manualQuestion || !manualAnswer) {
      alert('Please fill in both the question and answer');
      return;
    }

    const flashcard = {
      question: manualQuestion,
      answer: manualAnswer,
      user: userInfo,
    };

    onSave(flashcard);
    setManualQuestion('');
    setManualAnswer('');
  };

  return (
    <div className="manual-flashcard-box">
      <h2>Create Flashcard Manually</h2>
      <textarea
        rows="2"
        cols="50"
        value={manualQuestion}
        onChange={(e) => setManualQuestion(e.target.value)}
        placeholder="Enter your question here..."
      ></textarea>
      <textarea
        rows="2"
        cols="50"
        value={manualAnswer}
        onChange={(e) => setManualAnswer(e.target.value)}
        placeholder="Enter your answer here..."
      ></textarea>
      <button className="btn" onClick={handleManualFlashcardCreation} disabled={!userInfo}>
        Create Flashcard
      </button>
    </div>
  );
};

export default ManualFlashcard;


// import React, { useState } from "react";

// const ManualFlashcard = ({ userInfo }) => {
//   const [manualQuestion, setManualQuestion] = useState('');
//   const [manualAnswer, setManualAnswer] = useState('');

//   const handleManualFlashcardCreation = async () => {
//     if (!manualQuestion || !manualAnswer) {
//       alert('Please fill in both the question and answer');
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:3000/create-flashcard", {
//         method: "POST",
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ question: manualQuestion, answer: manualAnswer, user: userInfo })
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText);
//       }

//       alert('Flashcard created successfully');
//       // fetchSavedFlashcards(userInfo); // Refresh the saved flashcards after creating a new one
//       setManualQuestion('');
//       setManualAnswer('');
//     } catch (error) {
//       console.error('Error creating flashcard:', error);
//       alert(`Error creating flashcard: ${error.message}`);
//     }
//   };

//   return (
//     <div className="manual-flashcard-box">
//       <h2>Create Flashcard Manually</h2>
//       <textarea
//         rows="2"
//         cols="50"
//         value={manualQuestion}
//         onChange={(e) => setManualQuestion(e.target.value)}
//         placeholder="Enter your question here..."
//       ></textarea>
//       <textarea
//         rows="2"
//         cols="50"
//         value={manualAnswer}
//         onChange={(e) => setManualAnswer(e.target.value)}
//         placeholder="Enter your answer here..."
//       ></textarea>
//       <button className="btn" onClick={handleManualFlashcardCreation} disabled={!userInfo}>
//         Create Flashcard
//       </button>
//     </div>
//   );
// };

// export default ManualFlashcard;
