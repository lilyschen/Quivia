import React, { useState, useEffect } from "react";
import Nav from "../components/nav/NavBar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const StudySession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0(); 
  const flashcards = location.state?.flashcards || [];
  const studySetId = location.state?.studySetId; 
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionProgress, setSessionProgress] = useState([]);
  const [studySessionId, setStudySessionId] = useState(null); 
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      initializeSession();
    }
  }, [isAuthenticated, isLoading]); // Only call when authentication status is settled

  const initializeSession = async () => {
    if (!isAuthenticated || isLoading || !studySetId) {
      console.error("User is not authenticated or loading or missing studySetId");
      return;
    }

    setLoading(true); // Start loading

    try {
      console.log("Starting study session...");

      const response = await fetch("http://localhost:3000/start-study-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studySetId: studySetId, 
          user: { sub: user.sub },  
        }),
      });

      if (!response.ok) {
        console.error("Error starting study session:", response.statusText);
        throw new Error("Failed to start study session");
      }

      const data = await response.json();
      setSessionProgress(data.studySession.progress || []);

      if (data.studySession && data.studySession._id) {
        setStudySessionId(data.studySession._id);
        console.log(`Study session started with ID: ${data.studySession._id}`);
      } else {
        console.error("No studySessionId returned from API.");
      }
    } catch (error) {
      console.error("Error starting study session:", error);
      alert("Error starting study session. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false); // Reset flip state
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false); // Reset flip state
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleCardFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkAs = async (status) => {
    const flashcard = flashcards[currentCardIndex];

    if (!studySessionId) {
      console.error("Missing studySessionId");  
      return;
    }

    if (!flashcard) {
      console.error("No flashcard found at current index.");  
      return;
    }

    try {
      console.log(`Marking flashcard "${flashcard.question}" as ${status}.`);

      const response = await fetch(
        `http://localhost:3000/update-study-progress`,
        {
          method: "PUT", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studySessionId, 
            flashcardId: flashcard._id, 
            status,
          }),
        }
      );

      if (!response.ok) {
        console.error("Error updating study session progress:", response.statusText);
        throw new Error("Failed to update study session progress");
      }

      const updatedProgress = await response.json();
      setSessionProgress(updatedProgress.progress);

      console.log(`Flashcard "${flashcard.question}" marked as ${status}.`);
    } catch (error) {
      console.error("Error updating study session progress:", error);
    }

    handleNextCard(); 
  };

  const handleEndSession = async () => {
    if (!studySessionId) {
      console.error("Missing studySessionId"); 
      return;
    }
  
    try {
      console.log("Ending study session...");
  
      const response = await fetch(
        `http://localhost:3000/complete-study-session`,  
        {
          method: "PUT",  
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studySessionId }),  
        }
      );
  
      if (!response.ok) {
        console.error("Error ending study session:", response.statusText);
        throw new Error("Failed to end study session");
      }
  
      const result = await response.json();
      console.log(
        `Study session has ended. ${result.correctCount} correct out of ${result.totalCount} flashcards.`
      );
  
      // Save to local storage for persistence
      localStorage.setItem(
        `lastSessionResults_${studySetId}`,
        JSON.stringify(result)
      );
  
      // Navigate back to the StudySetDetailPage with results in state
      navigate(`/study-set/${studySetId}`, {
        state: { lastSessionResults: result },
      });
    } catch (error) {
      console.error("Error ending study session:", error);
      alert(`Error ending study session: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="study-session-container">
        <div className="flashcard-counter">
          {currentCardIndex + 1}/{flashcards.length}
        </div>
        {flashcards.length > 0 ? (
          <div className="flashcard" onClick={handleCardFlip}>
            {isFlipped
              ? flashcards[currentCardIndex].answer
              : flashcards[currentCardIndex].question}
          </div>
        ) : (
          <p className="flashcard">No flashcards available</p>
        )}
        <div className="navigation-buttons">
          <button onClick={handlePrevCard} disabled={currentCardIndex === 0}>
            Previous
          </button>
          <button
            onClick={handleNextCard}
            disabled={currentCardIndex === flashcards.length - 1}
          >
            Next
          </button>
        </div>
        <p>How did you do?</p>
        <div className="progress-buttons">
          <button
            onClick={() => handleMarkAs("correct")}
            className="correct-button"
          >
            Correct
          </button>
          <button
            onClick={() => handleMarkAs("incorrect")}
            className="incorrect-button"
          >
            Incorrect
          </button>
        </div>
        <div className="end-session-button">
          <button onClick={handleEndSession} className="btn end-session">
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudySession;
