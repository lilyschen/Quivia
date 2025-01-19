import React, { useState } from "react";

const CreateStudySet = ({
  newStudySetName,
  setNewStudySetName,
  handleCreateStudySet,
  userInfo,
}) => {
  return (
    <div className="create-study-set-box">
      <h3>Create a New Study Set</h3>
      <input
        type="text"
        className="text"
        value={newStudySetName}
        onChange={(e) => setNewStudySetName(e.target.value)}
        placeholder="Enter study set name"
      />
      <button
        className="btn"
        onClick={handleCreateStudySet}
        disabled={!userInfo}
      >
        Add
      </button>
    </div>
  );
};

export default CreateStudySet;
