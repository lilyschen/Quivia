export const fetchSavedFlashcards = async (userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/fetch-flashcards", {
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
        console.error("Error fetching flashcards:", error);
        throw error;
    }
};

export const deleteFlashcard = async (flashcardId, userInfo) => {
    try {
        const response = await fetch("http://localhost:3000/delete-flashcard", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ flashcardId, user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("Error deleting flashcard:", error);
        throw error;
    }
};