import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import SavedFlashcards from "../components/SavedFlashcards";
import ManualFlashcard from "../components/ManualFlashcard";
import Nav from "../components/nav/NavBar";
import TextArea from "../components/TextArea";
import EditFlashcard from "../components/EditFlashcard";
import FlashcardList from "../components/FlashcardList";
import CreateStudySet from "../components/CreateStudySet";
import {
  fetchSavedFlashcards,
  deleteFlashcard,
} from "../services/flashcardService";
import {
  fetchStudySets,
  createStudySet,
  addFlashcardToStudySet,
} from "../services/studySetService";

const Upload = () => {
  const { user, isAuthenticated } = useAuth0();
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [savedFlashcards, setSavedFlashcards] = useState([]);
  const [studySets, setStudySets] = useState([]);
  const [selectedStudySet, setSelectedStudySet] = useState("");
  const [selectedFlashcardId, setSelectedFlashcardId] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFlashcard, setEditFlashcard] = useState({
    question: "",
    answer: "",
    _id: "",
  });
  const [newStudySetName, setNewStudySetName] = useState("");

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
    if (userInfo) {
      fetchSavedFlashcards(userInfo).then(setSavedFlashcards);
      fetchStudySets(userInfo).then(setStudySets);
    }
  }, [userInfo]);

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
      setFlashcards(data.flashcards);
      setFile(null);
      setNotes("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(`Error generating flashcards: ${error.message}`);
    }
  };

  const handleSaveFlashcard = async (flashcard) => {
    try {
      const response = await fetch("http://localhost:3000/save-flashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flashcard, user: userInfo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Flashcard saved successfully");
      fetchSavedFlashcards(userInfo); // Refresh the saved flashcards after saving a new one
    } catch (error) {
      console.error("Error saving flashcard:", error);
      alert(`Error saving flashcard: ${error.message}`);
    }
  };

  const handleCreateStudySet = async () => {
    if (!newStudySetName) {
      alert("Please enter a study set name");
      return;
    }

    try {
      await createStudySet(newStudySetName, userInfo);
      alert("Study set created successfully");
      setNewStudySetName("");
      fetchStudySets(userInfo).then(setStudySets);
    } catch (error) {
      console.error("Error creating study set:", error);
      alert(`Error creating study set: ${error.message}`);
    }
  };

  const handleAddFlashcardToStudySet = async (flashcardId, studySetId) => {
    try {
      await addFlashcardToStudySet(flashcardId, studySetId);
      alert("Flashcard added to study set successfully");
      fetchStudySets(userInfo).then(setStudySets);
    } catch (error) {
      console.error("Error adding flashcard to study set:", error);
      alert(`Error adding flashcard to study set: ${error.message}`);
    }
  };

  const handleDeleteFlashcard = async (flashcardId) => {
    try {
      await deleteFlashcard(flashcardId, userInfo);
      alert("Flashcard deleted successfully");
      fetchSavedFlashcards(userInfo).then(setSavedFlashcards);
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert(`Error deleting flashcard: ${error.message}`);
    }
  };

  const handleEditFlashcard = (flashcard) => {
    setEditFlashcard(flashcard);
    setEditMode(true);
  };

  const handleSaveEditFlashcard = async () => {
    try {
      const response = await fetch("http://localhost:3000/edit-flashcard", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcardId: editFlashcard._id,
          user: userInfo,
          question: editFlashcard.question,
          answer: editFlashcard.answer,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert("Flashcard updated successfully");
      fetchSavedFlashcards(userInfo).then(setSavedFlashcards); // Refresh the saved flashcards after updating
      setEditMode(false);
      setEditFlashcard({ question: "", answer: "", _id: "" });
    } catch (error) {
      console.error("Error updating flashcard:", error);
      alert(`Error updating flashcard: ${error.message}`);
    }
  };

  const handleCardClick = (index) => {
    setFlashcards((prevFlashcards) =>
      prevFlashcards.map((flashcard, i) =>
        i === index
          ? { ...flashcard, showAnswer: !flashcard.showAnswer }
          : flashcard
      )
    );
  };

  const handleSavedCardClick = (index) => {
    setSavedFlashcards((prevFlashcards) =>
      prevFlashcards.map((flashcard, i) =>
        i === index
          ? { ...flashcard, showAnswer: !flashcard.showAnswer }
          : flashcard
      )
    );
  };

  const handleSelectStudySet = (studySetId) => {
    setSelectedStudySet(studySetId);
  };

  const fetchFlashcardsInStudySet = async (studySetName) => {
    try {
      const response = await fetch("http://localhost:3000/view-study-set", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studySetName, user: userInfo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const flashcards = await response.json();
      setSavedFlashcards(flashcards); // Display flashcards of the selected study set
    } catch (error) {
      console.error("Error fetching study set flashcards:", error);
      alert(`Error fetching study set flashcards: ${error.message}`);
    }
  };

  return (
    <div className="overlay">
      <Nav />
      <div className="upload-page">
        <div className="input-box">
          <p className="subtitle">
            Upload your course notes or paste them below to create a
            personalized study guide!
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
            disabled={!userInfo}
          >
            Generate Flashcards
          </button>
        </div>

        <ManualFlashcard
          userInfo={userInfo}
          fetchSavedFlashcards={fetchSavedFlashcards}
        />

        <CreateStudySet
          newStudySetName={newStudySetName}
          setNewStudySetName={setNewStudySetName}
          handleCreateStudySet={handleCreateStudySet}
          userInfo={userInfo}
        />

        <div className="input-box">
          <h3>Add Flashcard to Study Set</h3>
          <select
            onChange={(e) => setSelectedStudySet(e.target.value)}
            value={selectedStudySet}
          >
            <option value="">Select Study Set</option>
            {studySets.map((set) => (
              <option key={set._id} value={set._id}>
                {set.name}
              </option>
            ))}
          </select>
          <button
            className="btn"
            onClick={() =>
              handleAddFlashcardToStudySet(
                selectedFlashcardId,
                selectedStudySet
              )
            }
            disabled={!userInfo || !selectedStudySet || !selectedFlashcardId}
          >
            Add Flashcard to Study Set
          </button>
        </div>

        <FlashcardList
          flashcards={flashcards}
          handleCardClick={handleCardClick}
          handleSaveFlashcard={handleSaveFlashcard}
        />

        <SavedFlashcards
          savedFlashcards={savedFlashcards}
          handleSavedCardClick={handleSavedCardClick}
          handleDeleteFlashcard={handleDeleteFlashcard}
          handleEditFlashcard={handleEditFlashcard}
          handleAddFlashcardToStudySet={handleAddFlashcardToStudySet}
          selectedStudySet={selectedStudySet}
          setSelectedFlashcardId={setSelectedFlashcardId}
        />

        {editMode && (
          <EditFlashcard
            editFlashcard={editFlashcard}
            setEditFlashcard={setEditFlashcard}
            handleSaveEditFlashcard={handleSaveEditFlashcard}
            setEditMode={setEditMode}
          />
        )}
      </div>
    </div>
  );
};

export default Upload;
