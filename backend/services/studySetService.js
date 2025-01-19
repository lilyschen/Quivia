const StudySet = require("../models/StudySet");

exports.createStudySet = async (req) => {
  const { name, user } = req.body;
  const userId = user ? user.sub : "defaultUser";

  const existingStudySet = await StudySet.findOne({ name, userId });
  if (existingStudySet) {
    return { error: "Study set with this name already exists" };
  }

  const studySet = new StudySet({ name, userId, flashcards: [] });
  await studySet.save();
  return { message: "Study set created successfully", studySet };
};

exports.addFlashcardToStudySet = async (req) => {
  const { studySetId, flashcardId } = req.body;
  const studySet = await StudySet.findById(studySetId);
  if (!studySet) {
    return { error: "Study set not found" };
  }
  studySet.flashcards.push(flashcardId);
  await studySet.save();
  return { message: "Flashcard added to study set successfully", studySet };
};

exports.fetchStudySets = async (req) => {
  const { user } = req.body;
  const userId = user ? user.sub : "defaultUser";
  const studySets = await StudySet.find({ userId }).populate("flashcards");
  return studySets;
};

exports.viewStudySet = async (req) => {
  const { studySetName, user } = req.body;
  const userId = user ? user.sub : "defaultUser";

  const studySet = await StudySet.findOne({
    name: studySetName,
    userId,
  }).populate("flashcards");
  if (!studySet) {
    return { error: "Study set not found" };
  }

  return studySet.flashcards;
};

exports.getStudySetById = async (studySetId) => {
  try {
    const studySet = await StudySet.findById(studySetId).populate("flashcards");
    return studySet;
  } catch (error) {
    console.error("Error fetching study set by ID:", error);
    throw error;
  }
};

exports.updateStudySetName = async (req) => {
  const { studySetId, newName, user } = req.body;
  const userId = user ? user.sub : "defaultUser";

  // Check if the study set exists and belongs to the user
  const studySet = await StudySet.findOne({ _id: studySetId, userId });
  if (!studySet) {
    return { error: "Study set not found" };
  }

  // Check if the new name is already taken by another study set for the same user
  const existingStudySet = await StudySet.findOne({ name: newName, userId });
  if (existingStudySet) {
    return { error: "Another study set with this name already exists" };
  }

  // Update the study set name
  studySet.name = newName;
  await studySet.save();

  return { message: "Study set name updated successfully", studySet };
};
