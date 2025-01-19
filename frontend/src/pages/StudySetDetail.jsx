import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  fetchFlashcardsInStudySet,
  addFlashcardToStudySet,
  startStudySession,
} from "../services/studySetService";
import FlashcardList from "../components/FlashcardList";
import Nav from "../components/nav/NavBar";
import ManualFlashcard from "../components/ManualFlashcard";
import Modal from "../components/Modal";
import GenerateFlashcardsModal from "../components/GenerateFlashcardsModal";
import { useAuth0 } from "@auth0/auth0-react";
import UploadNotes from "../components/UploadNotes";
import { deleteFlashcard } from "../services/flashcardService";

const StudySetDetailPage = () => {
  const { studySetId } = useParams();
  const location = useLocation();
  const [flashcards, setFlashcards] = useState([]);
  const [studySetName, setStudySetName] = useState("");
  const [notes, setNotes] = useState("");
  const { user, isAuthenticated } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showManualFlashcard, setShowManualFlashcard] = useState(false);
  const [showGenerateFlashcardsModal, setShowGenerateFlashcardsModal] =
    useState(false);
  const navigate = useNavigate();
  const [lastSessionResults, setLastSessionResults] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const userInfo = {
        sub: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
        updated_at: user.updated_at,
      };
      setUserInfo(userInfo);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchStudySetDetails = async () => {
      try {
        const studySetData = await fetchFlashcardsInStudySet(studySetId);
        setFlashcards(studySetData.flashcards);
        setStudySetName(studySetData.name);
      } catch (err) {
        console.error("Error fetching study set:", err);
        alert("Error fetching study set. Please try again later.");
      }
    };

    fetchStudySetDetails();
  }, [studySetId]);

  useEffect(() => {
    // Check for last session results from location.state or local storage
    const resultsFromState = location.state?.lastSessionResults;
    const resultsFromStorage = localStorage.getItem(
      `lastSessionResults_${studySetId}`
    );

    if (resultsFromState) {
      setLastSessionResults(resultsFromState);
      localStorage.setItem(
        `lastSessionResults_${studySetId}`,
        JSON.stringify(resultsFromState)
      );
    } else if (resultsFromStorage) {
      setLastSessionResults(JSON.parse(resultsFromStorage));
    }
  }, [location.state, studySetId]);

  const handleCardClick = (index) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((flashcard, i) =>
        i === index
          ? { ...flashcard, showAnswer: !flashcard.showAnswer }
          : flashcard
      )
    );
  };

  const handleAddFlashcardToStudySet = async (flashcardId) => {
    try {
      await addFlashcardToStudySet(flashcardId, studySetId);
      alert("Flashcard added to study set successfully");
      // Refresh flashcards after adding a new one
      const studySetData = await fetchFlashcardsInStudySet(studySetId);
      setFlashcards(studySetData.flashcards);
    } catch (error) {
      console.error("Error adding flashcard to study set:", error);
      alert(`Error adding flashcard to study set: ${error.message}`);
    }
  };

  const handleManualFlashcardSave = async (flashcard) => {
    try {
      const response = await fetch("http://localhost:3000/create-flashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: flashcard.question,
          answer: flashcard.answer,
          user: userInfo,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const savedFlashcard = await response.json();

      await handleAddFlashcardToStudySet(savedFlashcard.flashcard._id);
      setShowManualFlashcard(false);
    } catch (error) {
      console.error("Error saving manual flashcard:", error);
      alert(`Error saving manual flashcard: ${error.message}`);
    }
  };

  const toggleEditMode = () => {
    setEditMode((prevMode) => !prevMode);
  };

  const toggleManualFlashcard = () => {
    console.log("Toggle Manual Flashcard clicked");
    setShowManualFlashcard((prev) => !prev);
  };

  const toggleGenerateFlashcardsModal = () => {
    setShowGenerateFlashcardsModal((prev) => !prev);
  };

  const handleFlashcardsGenerated = async (newFlashcards) => {
    try {
      // Add each generated flashcard to the study set
      for (const flashcard of newFlashcards) {
        const response = await fetch("http://localhost:3000/create-flashcard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: flashcard.question,
            answer: flashcard.answer,
            user: userInfo,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }

        const savedFlashcard = await response.json();
        await handleAddFlashcardToStudySet(savedFlashcard.flashcard._id);
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(`Error generating flashcards: ${error.message}`);
    } finally {
      setShowGenerateFlashcardsModal(false); // Close modal after flashcards are added
    }
  };

  const handleStartSession = () => {
    navigate(`/study-set/${studySetId}/study-session`, {
      state: { flashcards, studySetId },
    });
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      await deleteFlashcard(flashcardId, userInfo);
      setFlashcards(
        flashcards.filter((flashcard) => flashcard._id !== flashcardId)
      );
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert("Failed to delete flashcard");
    }
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="study-set-detail-page">
        <div className="study-set-name">
          <h2>{studySetName}</h2>
          {lastSessionResults && (
            <div className="last-session-results">
              <strong>Last Session:</strong> {lastSessionResults.correctCount}{" "}
              out of {lastSessionResults.totalCount} correct
            </div>
          )}
        </div>

        {flashcards.length > 0 ? (
          <>
            <FlashcardList
              flashcards={flashcards}
              handleCardClick={handleCardClick}
              editMode={editMode}
              handleDeleteFlashcard={handleDeleteFlashcard}
            />
          </>
        ) : (
          <p>
            You have not added any flashcards to {studySetName} yet. Please
            select an option to generate flashcards!
          </p>
        )}

        <div className="study-set-options">
          <button className="get-started-btn" onClick={toggleEditMode}>
            {editMode ? "Done Editing" : "Edit"}
          </button>

          <button onClick={handleStartSession} className="btn">
            Start a Session
          </button>

          <button className="btn" onClick={toggleManualFlashcard}>
            {showManualFlashcard ? "Cancel" : "Create Flashcard Manually"}
          </button>

          <button className="btn" onClick={toggleGenerateFlashcardsModal}>
            {showGenerateFlashcardsModal ? "Cancel" : "Generate Flashcards"}
          </button>

          {showManualFlashcard && (
            <Modal onClose={toggleManualFlashcard}>
              <ManualFlashcard
                userInfo={userInfo}
                onSave={handleManualFlashcardSave}
              />
            </Modal>
          )}

          {showGenerateFlashcardsModal && (
            <GenerateFlashcardsModal
              onClose={toggleGenerateFlashcardsModal}
              userInfo={userInfo}
              onFlashcardsGenerated={handleFlashcardsGenerated}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudySetDetailPage;
