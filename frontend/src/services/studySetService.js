export const fetchStudySets = async (userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/fetch-study-sets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching study sets:", error);
        throw error;
    }
};

export const createStudySet = async (newStudySetName, userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/create-study-set", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: newStudySetName, user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error creating study set:", error);
        throw error;
    }
};

export const deleteStudySet = async (studySetId, userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/delete-study-set", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studySetId, user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting study set:", error);
        throw error;
    }
};

export const addFlashcardToStudySet = async (flashcardId, studySetId) => {
    try {
        const response = await fetch(
            "http://localhost:3000/add-flashcard-to-study-set",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ flashcardId, studySetId }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error adding flashcard to study set:", error);
        throw error;
    }
};

export const startStudySession = async (studySetId, userId) => {
    try {
        const response = await fetch("http://localhost:3000/start-study-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studySetId, userId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error starting study session:", error);
        throw error;
    }
};

export const updateStudyProgress = async (sessionId, flashcardId, status) => {
    try {
        const response = await fetch("http://localhost:3000/update-study-progress", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId, flashcardId, status }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating study progress:", error);
        throw error;
    }
};

export const completeStudySession = async (sessionId) => {
    try {
        const response = await fetch("http://localhost:3000/complete-study-session", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error completing study session:", error);
        throw error;
    }
};

export const getStudySessionsForSet = async (studySetId, userId) => {
    try {
        const response = await fetch(
            `http://localhost:3000/get-study-sessions-for-set?studySetId=${studySetId}&userId=${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching study sessions:", error);
        throw error;
    }
};

export const fetchFlashcardsInStudySet = async (studySetId) => {
    try {
      const response = await fetch(`http://localhost:3000/study-set/${studySetId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching study set flashcards:", error);
      throw error;
    }
  };

// Example for updating the study set name
export const updateStudySetName = async (studySetId, newName, userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/update-study-set-name", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ studySetId, newName, user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating study set name:", error);
        throw error;
    }
};

