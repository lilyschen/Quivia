import { useNavigate } from "react-router-dom";

const StudySets = ({ studySets }) => {
  const navigate = useNavigate();

  const handleStudySetClick = (studySetId) => {
    navigate(`/study-set/${studySetId}`);
  };

  return (
    <div className="studysets-container">
      <h3>Your Study Sets</h3>
      {studySets.length > 0 ? (
        <ul className="studysets-list">
          {studySets.map((set) => (
            <li key={set._id}>
              <button
                onClick={() => handleStudySetClick(set._id)}
                className="studyset-button"
              >
                {set.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Create a new study set to get started!</p>
      )}
    </div>
  );
};

export default StudySets;

// const StudySets = ({ studySets, handleSelectStudySet, fetchFlashcardsInStudySet }) => {
//     return (
//       <div className="studysets-container">
//         <h3>Your Study Sets</h3>
//         <ul>
//           {studySets.map((set) => (
//             <li key={set._id}>
//               <button
//                 onClick={() => {
//                   handleSelectStudySet(set._id);
//                   fetchFlashcardsInStudySet(set.name); // Fetch flashcards for this study set
//                 }}
//               >
//                 {set.name}
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   export default StudySets;
