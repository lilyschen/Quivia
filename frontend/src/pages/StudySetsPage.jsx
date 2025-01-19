import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { fetchStudySets, createStudySet, updateStudySetName} from "../services/studySetService";
import { useNavigate } from "react-router-dom";
import Nav from "../components/nav/NavBar";
import CreateStudySet from "../components/CreateStudySet";
import StudySets from "../components/StudySets";

const StudySetsPage = () => {
  const { user } = useAuth0();
  const [studySets, setStudySets] = useState([]);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);

  const [newStudySetName, setNewStudySetName] = useState("");

  const [editedStudySetName, setEditedStudySetName] = useState("");

  const [selectedStudySetId, setSelectedStudySetId] = useState(null);

  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const getStudySets = async () => {
      if (user) {
        const userInfo = {
          sub: user.sub,
          email: user.email,
        };
        setUserInfo(userInfo);
        const sets = await fetchStudySets(userInfo);
        setStudySets(sets);
      }
    };

    getStudySets();
  }, [user]);

  const handleStudySetClick = (studySetId) => {
    navigate(`/study-set/${studySetId}`);
  };

  const handleCreateStudySet = async () => {
    if (!newStudySetName) {
      alert("Please enter a study set name");
      return;
    }

    console.log("Creating study set with:", newStudySetName, userInfo);

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

  const handleUpdateStudySetName = async () => {
    if (!editedStudySetName || !selectedStudySetId) {
      alert("Please select a study set and enter a new name");
      return;
    }
    try {
      await updateStudySetName(selectedStudySetId, editedStudySetName, userInfo);
      alert("Study set name updated successfully");
      setEditedStudySetName("");
      setSelectedStudySetId(null);
      setShowEdit(false);
      fetchStudySets(userInfo).then(setStudySets);
    } catch (error) {
      console.error("Error updating study set name:", error);
      alert(`Error updating study set name: ${error.message}`);
    }
  };

  return (
      <div className="overlay">
        <Nav />
        <div className="studysets-page">
          <div className="studysets-container">
            {/* StudySets Component */}
            <StudySets studySets={studySets} />

            {/* Edit Name Button and Form */}
            <div className="edit-study-set">
              <button className="btn" onClick={() => setShowEdit(!showEdit)}>
                Edit Name
              </button>

              {showEdit && (
                  <div className="edit-form">
                    <select
                        value={selectedStudySetId || ""}
                        onChange={(e) => setSelectedStudySetId(e.target.value)}
                    >
                      <option value="">Select Study Set</option>
                      {studySets.map((studySet) => (
                          <option key={studySet._id} value={studySet._id}>
                            {studySet.name}
                          </option>
                      ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Enter new study set name"
                        value={editedStudySetName}
                        onChange={(e) => setEditedStudySetName(e.target.value)}
                    />
                    <button className="btn" onClick={handleUpdateStudySetName}>Update Name</button>
                    <button className="btn" onClick={() => setShowEdit(false)}>Cancel</button>
                  </div>
              )}
            </div>
          </div>

          <CreateStudySet
              newStudySetName={newStudySetName}
              setNewStudySetName={setNewStudySetName}
              handleCreateStudySet={handleCreateStudySet}
              userInfo={userInfo}
          />
        </div>
      </div>
  );
};

export default StudySetsPage;
