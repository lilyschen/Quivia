const Flashcard = require("../models/Flashcard");
const pdfParse = require("../utils/pdfUtils");
const fs = require("fs");
const openai = require("openai");
const OpenAI = openai.OpenAI;
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.generateFlashcards = async (req) => {
  try {
    console.log("Endpoint hit"); // Log 1
    let notes = req.body.notes || "";

    if (req.file) {
      console.log("File received"); // Log 2
      if (req.file.mimetype !== "application/pdf") {
        console.log("Uploaded file is not a PDF"); // Log 3
      }

      const pdfData = await pdfParse(fs.readFileSync(req.file.path));
      notes += pdfData;
      console.log("PDF parsed successfully"); // Log 4
    }

    if (!notes) {
      console.log("No notes provided"); // Log 5
    }

    // Mocking OpenAI API response
    // const mockResponse = {
    //   choices: [
    //     {
    //       text: "Question 1 What is the capital of France?\nAnswer Paris\nQuestion 2 What is the largest planet?\nAnswer Jupiter",
    //     },
    //   ],
    // };

    // const flashcards = mockResponse.choices[0].text
    //   .trim()
    //   .split("\n")
    //   .reduce((acc, line) => {
    //     if (line.startsWith("Q:") || line.startsWith("Question")) {
    //       acc.push({
    //         question: line.slice(line.startsWith("Q:") ? 3 : 10).trim(),
    //         answer: "",
    //         showAnswer: false,
    //       });
    //     } else if (
    //       (line.startsWith("A:") || line.startsWith("Answer")) &&
    //       acc.length > 0
    //     ) {
    //       acc[acc.length - 1].answer = line
    //         .slice(line.startsWith("A:") ? 3 : 7)
    //         .trim();
    //     }
    //     return acc;
    //   }, []);
    //
    // if (flashcards.length === 0) {
    //   console.log("No flashcards generated."); // Log 6
    //   return { flashcards }; // Return an empty array
    // }

    const response = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
            { role: 'system', content: 'Generate flashcards from the following notes:' },
            { role: 'user', content: notes },
            { role: 'system', content: 'You are a helpful assistant.' },
            {
                role: 'user',
                content: `Generate question and answer flashcards from the following notes.
                          Please include a mix of true/false, fill-in-the-blank, and multiple-choice questions.
                          Format each flashcard as "Q: [Question]" and "A: [Answer]".
                          Here are the notes:\n${notes}`
            }
        ],
        max_tokens: 150,
    });

    console.log('OpenAI API response received'); // Log 7
    console.log('OpenAI API response:', response.choices[0].message.content);
    // const flashcards = response.choices[0].message.content.trim().split('\n').map(line => {
    //     const [question, answer] = line.split(':');
    //     return { question, answer, showAnswer: false };
    // });

    const flashcards = response.choices[0].message.content.trim().split('\n').reduce((acc, line, index, arr) => {
        if (line.startsWith('Q:')) {
            acc.push({ question: line.slice(3).trim(), answer: '', showAnswer: false });
        } else if (line.startsWith('A:') && acc.length > 0) {
            acc[acc.length - 1].answer = line.slice(3).trim();
        }
        return acc;
    }, []);

    console.log("Parsed flashcards:", flashcards);

    // Filter out flashcards with missing answers
    const validFlashcards = flashcards.filter(flashcard => flashcard.answer.trim() !== '');

    if (validFlashcards.length === 0) {
      console.log("No valid flashcards generated."); // Log 7
      return { flashcards: validFlashcards }; // Return an empty array
    }


    // if (flashcards.length === 0) {
    //   console.log("No flashcards generated."); // Log 6
    //   return { flashcards }; // Return an empty array
    // }

    // Save each generated flashcard to the database
    for (const flashcard of validFlashcards) {
      try {
        const userId = req.body.user ? req.body.user.sub : "defaultUser";
        const userEmail = req.body.user ? req.body.user.email : "defaultEmail";

        const flashcardDoc = new Flashcard({
          question: flashcard.question,
          answer: flashcard.answer,
          userId,
          userEmail,
          showAnswer: flashcard.showAnswer,
        });

        await flashcardDoc.save();
        console.log(`Flashcard saved: ${flashcard.question}`); // Log 7
      } catch (saveError) {
        console.error("Error saving flashcard:", saveError); // Log 8
        return { error: "Error saving generated flashcards" };
      }
    }

    return { flashcards: validFlashcards };
  } catch (error) {
    console.error("Error generating flashcards:", error); // Log 9
    return { error: "Error generating flashcards" };
  } finally {
    if (req.file) {
      fs.unlinkSync(req.file.path);
      console.log("Temporary file deleted"); // Log 10
    }
  }
};

exports.saveFlashcard = async (req) => {
  try {
    const { flashcard, user } = req.body;
    const userId = user ? user.sub : "defaultUser";
    const userEmail = user ? user.email : "defaultEmail";
    const flashcardDoc = { ...flashcard, userId, userEmail };
    await Flashcard.create(flashcardDoc);

    return { message: "Flashcard saved successfully" };
  } catch (error) {
    console.error("Error saving flashcard:", error);
    return { error: "Error saving flashcard" };
  }
};

exports.getFlashcards = async (req) => {
  try {
    const userId = req.body.user ? req.body.user.sub : "defaultUser";
    const flashcards = await Flashcard.find({ userId });
    return flashcards;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    throw new Error("Error fetching flashcards");
  }
};

exports.fetchFlashcards = async (req) => {
  try {
    const userEmail = req.body.user ? req.body.user.email : "defaultEmail";
    const flashcards = await Flashcard.find({ userEmail });
    return flashcards;
  } catch (error) {
    console.error("Error fetching flashcards:", error);
    throw new Error("Error fetching flashcards");
  }
};

exports.deleteFlashcard = async (req) => {
  try {
    const { flashcardId, user } = req.body;
    const userEmail = user ? user.email : "defaultEmail";

    const flashcard = await Flashcard.findOneAndDelete({
      _id: flashcardId,
      userEmail,
    });

    if (!flashcard) {
      return {
        error: "Flashcard not found or you do not have permission to delete it",
      };
    }

    return { message: "Flashcard deleted successfully" };
  } catch (error) {
    console.error("Error deleting flashcard:", error);
    return { error: "Error deleting flashcard" };
  }
};

exports.editFlashcard = async (req) => {
  try {
    const { flashcardId, user, question, answer } = req.body;
    const userEmail = user ? user.email : "defaultEmail";

    const flashcard = await Flashcard.findOneAndUpdate(
      { _id: flashcardId, userEmail },
      { question, answer },
      { new: true }
    );

    if (!flashcard) {
      return {
        error: "Flashcard not found or you do not have permission to edit it",
      };
    }

    return { message: "Flashcard updated successfully", flashcard };
  } catch (error) {
    console.error("Error updating flashcard:", error);
    return { error: "Error updating flashcard" };
  }
};

exports.createFlashcard = async (req) => {
  try {
    const { question, answer, user } = req.body;
    const userId = user ? user.sub : "defaultUser";
    const userEmail = user ? user.email : "defaultEmail";

    const flashcard = new Flashcard({
      question,
      answer,
      userId,
      userEmail,
      showAnswer: false,
    });
    await flashcard.save();

    return { message: "Flashcard created successfully", flashcard };
  } catch (error) {
    console.error("Error creating flashcard:", error);
    return { error: "Error creating flashcard" };
  }
};
