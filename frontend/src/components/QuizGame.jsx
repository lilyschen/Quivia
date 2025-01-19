import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { Trophy, Loader2 } from 'lucide-react';

const QuizGame = ({ studySetId }) => {
  const [gameSession, setGameSession] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!studySetId) {
      setError('No study set ID provided');
      setLoading(false);
      return;
    }
    startNewGame();
  }, [studySetId]);

  const startNewGame = async () => {
    try {
      setLoading(true);
      setError(null);
      setGameCompleted(false); // Reset game completion state
      setCurrentQuestionIndex(0); // Reset question index
      setQuestions([]); // Clear questions array (this is optional, depending on your logic)
      setCorrectAnswers(0);
      
      if (!user?.sub) {
        throw new Error('User must be logged in to start a quiz');
      }
  
      const response = await fetch('http://localhost:3000/start-quiz-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: { sub: user.sub },
          studySetId: studySetId
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start quiz');
      }
  
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions available for this study set');
      }
  
      setGameSession(data.gameSession);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerSubmit = async (selectedAnswer) => {
    try {
      if (!gameSession) {
        throw new Error('No active game session');
      }
  
      const currentQuestion = questions[currentQuestionIndex];
      console.log(currentQuestion)
      if (!currentQuestion) {
        throw new Error('Invalid question index');
      }
  
      const response = await fetch('http://localhost:3000/submit-quiz-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameSessionId: gameSession,
          questionId: currentQuestion.id,
          answer: selectedAnswer
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit answer');
      }
  
      // Ensure the answer comparison is correct
      if (selectedAnswer === currentQuestion.correctAnswer) {  // Compare selected answer with correct answer
        setCorrectAnswers(prev => prev + 1);
      }

      console.log('Submitted Answer:', selectedAnswer);
      console.log('Correct Answer:', currentQuestion.correctAnswer);

      // Remove focus from all option buttons
      document.querySelectorAll('.option-button').forEach(button => {
        button.blur();
      });

      // Check if quiz is complete and update question index
      if (currentQuestionIndex + 1 >= questions.length) {
        setGameCompleted(true);
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }

      return data;

    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
        <div className="text-red-500 mb-6 text-center font-medium">{error}</div>
        <button 
          onClick={startNewGame}
          className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
        <div className="text-gray-600 mb-6 text-center">No questions available for this study set</div>
        <button 
          onClick={startNewGame}
          className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 text-2xl font-bold text-pink-500">
            <Trophy className="h-8 w-8" />
            Quiz Completed!
          </div>
        </div>
        <div className="text-center">
        <p className="text-xl mb-8 text-gray-700">
        Your final score: {correctAnswers} out of {questions.length}
        </p>
          <button 
            onClick={startNewGame}
            className="px-8 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="quiz-container">
    <h2 className="question-text text-center">
        Question {currentQuestionIndex + 1} of {questions.length}
    </h2>
    <p className="question mb-8 text-center">{currentQuestion.question}</p>
    <div className="options-container flex flex-col gap-4 items-center justify-center">
        {currentQuestion.options.map((option, index) => (
        <button
            key={index}
            className="option-button w-full text-center px-6 py-4 border-2 border-gray-200 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-all duration-200 text-gray-700 font-medium"
            onClick={() => handleAnswerSubmit(option)}
        >
            {option}
        </button>
        ))}
    </div>
    </div>

  );
  
};

export default QuizGame;
