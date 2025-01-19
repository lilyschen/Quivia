import React from 'react';
import { useParams } from 'react-router-dom';
import Nav from "../components/nav/NavBar";
import QuizGame from '../components/QuizGame';

const QuizPage = () => {
  const { studySetId, shareableId } = useParams();
  
  return (
    <div className="overlay">
      <Nav />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quiz Challenge</h1>
        <QuizGame 
          studySetId={studySetId} 
          shareableId={shareableId}
        />
      </div>
    </div>
  );
};

export default QuizPage;